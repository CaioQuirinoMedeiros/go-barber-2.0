import React from 'react';
import { Switch } from 'react-router-dom';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';

import MyRoute from './Route';

const Routes: React.FC = () => {
  return (
    <Switch>
      <MyRoute path="/" component={Login} exact />
      <MyRoute path="/signup" component={SignUp} exact />
      <MyRoute path="/dashboard" component={Dashboard} exact isPrivate />
    </Switch>
  );
};
export default Routes;
