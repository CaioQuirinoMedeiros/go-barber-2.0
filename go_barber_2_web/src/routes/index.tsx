import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

import { AuthRouterWrapper } from './CustomRoute';

const router = createBrowserRouter([
  {
    path: '/*',
    element: (
      <AuthRouterWrapper>
        <Login />
      </AuthRouterWrapper>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthRouterWrapper>
        <SignUp />
      </AuthRouterWrapper>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthRouterWrapper>
        <ForgotPassword />
      </AuthRouterWrapper>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthRouterWrapper>
        <ResetPassword />
      </AuthRouterWrapper>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <AuthRouterWrapper isPrivate>
        <Dashboard />
      </AuthRouterWrapper>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthRouterWrapper isPrivate>
        <Profile />
      </AuthRouterWrapper>
    ),
  },
]);

export function RootRouter() {
  return <RouterProvider router={router} />;
}
