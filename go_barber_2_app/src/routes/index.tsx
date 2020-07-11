import React from 'react';

import { useAuth } from '../hooks/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
