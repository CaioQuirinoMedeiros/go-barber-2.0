import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './hooks/AuthContext';
import GlobalStyle from './styles/global';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
