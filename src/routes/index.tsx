import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Login} exact />
      <Route path="/signup" component={SignUp} exact />
    </Switch>
  );
};
export default Routes;
