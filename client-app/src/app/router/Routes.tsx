import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from '../layout/NotFound';
import { LoginForm } from '../../features/user/LoginForm';
import { HomePage } from '../../features/home/HomePage';

// Wrapper component to handle form key
const ActivityFormWrapper = () => <ActivityForm />;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'activities', element: <ActivityDashboard /> },
      { path: 'activities/:id', element: <ActivityDetails /> },
      { path: 'createActivity', element: <ActivityFormWrapper /> },
      { path: 'manage/:id', element: <ActivityFormWrapper /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'not-found', element: <NotFound /> },
      { path: '*', element: <Navigate replace to='/not-found' /> }
    ]
  }
];

export const router = createBrowserRouter(routes); 