import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

type MyRouteProps = {
  children: any;
  isPrivate?: boolean;
};

export const AuthRouterWrapper = ({ isPrivate, children }: MyRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!!isPrivate === !!user) {
    return children;
  } else {
    const redirectTo = isPrivate ? '/' : '/dashboard';
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
};
