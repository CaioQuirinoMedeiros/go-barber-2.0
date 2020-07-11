import React from 'react';
import { Switch } from 'react-router-dom';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import MyRoute from './Route';

const Routes: React.FC = () => {
  return (
    <Switch>
      <MyRoute path="/" component={Login} exact />
      <MyRoute path="/signup" component={SignUp} exact />
      <MyRoute path="/forgot-password" component={ForgotPassword} exact />
      <MyRoute path="/reset-password" component={ResetPassword} />
      <MyRoute path="/dashboard" component={Dashboard} exact isPrivate />
      <MyRoute path="/profile" component={Profile} exact isPrivate />
    </Switch>
  );
};
export default Routes;
