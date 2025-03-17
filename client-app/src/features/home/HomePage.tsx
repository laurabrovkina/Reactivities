import React from 'react';
import { Container, Segment, Header, Button, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterUser';

interface HomeButtonProps {
  onClick?: () => void;
  to?: string;
  content: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({ onClick, to, content }) => (
  <Button
    as={to ? Link : undefined}
    to={to}
    onClick={onClick}
    size="huge"
    inverted
    className="home-button"
  >
    {content}
  </Button>
);

const HomePage = observer(() => {
  const { userStore, modalStore } = useStore();
  const { isLoggedIn, user } = userStore;
  const { openModal } = modalStore;

  const handleLogin = () => openModal(<LoginForm />);
  const handleRegister = () => openModal(<RegisterForm />);

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container>
        <Grid centered verticalAlign="middle" style={{ minHeight: '100vh' }}>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" inverted>
              <Image
                size="massive"
                src="/assets/logo.png"
                alt="Reactivities Logo"
                style={{ 
                  marginBottom: 12,
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
                }}
              />
              <Header.Content>
                Reactivities
                <Header.Subheader>
                  Share and discover activities with friends
                </Header.Subheader>
              </Header.Content>
            </Header>

            {isLoggedIn && user ? (
              <>
                <Header 
                  as="h2" 
                  inverted 
                  content={`Welcome back, ${user.displayName}!`}
                  style={{ marginBottom: '2em' }}
                />
                <HomeButton 
                  to="/activities" 
                  content="Go to Activities"
                />
              </>
            ) : (
              <>
                <Header 
                  as="h2" 
                  inverted 
                  content="Welcome to Reactivities" 
                  style={{ marginBottom: '2em' }}
                />
                <div>
                  <HomeButton 
                    onClick={handleLogin} 
                    content="Login"
                  />
                  <HomeButton 
                    onClick={handleRegister} 
                    content="Register"
                  />
                </div>
              </>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  );
});

export default HomePage;
