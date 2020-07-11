import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface MyRouteProps extends RouteProps {
  isPrivate?: boolean;
}

const MyRoute: React.FC<MyRouteProps> = ({ isPrivate = false, ...rest }) => {
  const { user } = useAuth();

  return isPrivate === !!user ? (
    <Route {...rest} />
  ) : (
    <Redirect
      to={{
        pathname: isPrivate ? '/' : '/dashboard',
        state: { from: rest.location },
      }}
    />
  );
};

export default MyRoute;
