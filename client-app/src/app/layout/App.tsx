import { useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { HomePage } from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { LoginForm } from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { LoadingComponent } from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

const App = observer(() => {
  const location = useLocation();
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { loadUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      loadUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [loadUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content='Loading app...' />;

  return (
    <>
      <ModalContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/*'
          element={
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Routes>
                  <Route path='activities' element={<ActivityDashboard />} />
                  <Route path='activities/:id' element={<ActivityDetails />} />
                  <Route 
                    path='createActivity' 
                    element={<ActivityForm key={location.key} />} 
                  />
                  <Route 
                    path='manage/:id' 
                    element={<ActivityForm key={location.key} />} 
                  />
                  <Route path='login' element={<LoginForm />} />
                  <Route path='not-found' element={<NotFound />} />
                  <Route path='*' element={<Navigate replace to='/not-found' />} />
                </Routes>
              </Container>
            </>
          }
        />
      </Routes>
    </>
  );
});

export default App;
