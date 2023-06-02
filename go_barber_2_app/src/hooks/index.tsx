import React from 'react';

import { AuthProvider } from './auth';

function AppProvider({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppProvider;
