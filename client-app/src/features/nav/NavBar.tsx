import React from 'react';
import { Menu, Container, Button, Dropdown, Image, Icon, SemanticICONS } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useStore } from '../../app/stores/store';

interface NavItemProps {
  to: string;
  content: string;
  icon?: SemanticICONS;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, content, icon, exact }) => (
  <Menu.Item as={NavLink} to={to} end={exact}>
    {icon && <Icon name={icon} />}
    {content}
  </Menu.Item>
);

const NavBar = observer(() => {
  const { userStore } = useStore();
  const { user, logout } = userStore;
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} to="/" end>
          <img 
            src="/assets/logo.png" 
            alt="Reactivities Logo" 
            style={{ 
              marginRight: '1em',
              height: '2.5em'
            }} 
          />
          Reactivities
        </Menu.Item>

        {user && (
          <>
            <NavItem 
              to="/activities" 
              content="Activities"
              icon="calendar"
            />
            <Menu.Item>
              <Button
                as={NavLink}
                to="/createActivity"
                positive
                content="Create Activity"
                icon="plus"
                labelPosition="left"
                active={location.pathname === '/createActivity'}
              />
            </Menu.Item>
          </>
        )}

        <Menu.Item position="right">
          {user ? (
            <Dropdown
              pointing="top right"
              text={user.displayName}
              className="link item"
              trigger={
                <span>
                  <Image 
                    avatar 
                    src={user.image || "/assets/user.png"} 
                    alt={`${user.displayName}'s avatar`}
                    style={{ marginRight: '0.5em' }}
                  />
                  {user.displayName}
                </span>
              }
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`}
                  text="My Profile"
                  icon="user"
                />
                <Dropdown.Item
                  as={Link}
                  to="/settings"
                  text="Settings"
                  icon="settings"
                />
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  text="Logout"
                  icon="power"
                />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Button
                as={NavLink}
                to="/login"
                inverted
                content="Login"
                icon="sign in"
                labelPosition="left"
              />
              <Button
                as={NavLink}
                to="/register"
                inverted
                content="Register"
                icon="user plus"
                labelPosition="left"
                style={{ marginLeft: '0.5em' }}
              />
            </>
          )}
        </Menu.Item>
      </Container>
    </Menu>
  );
});

export default NavBar;
