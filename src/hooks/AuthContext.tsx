import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';
import { TOKEN_KEY, USER_KEY } from '../constants/auth';

interface AuthContextData {
  user: object;
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signUp(credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  signOut(): void;
}

interface LoginResponse {
  token: string;
  user: object;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthState {
  token: string;
  user: object;
}

const AuthProvider: React.FC = ({ children }) => {
  const getInitialState = useCallback(() => {
    const tokenStorage = localStorage.getItem(TOKEN_KEY);
    const userStorage = localStorage.getItem(USER_KEY);

    if (tokenStorage && userStorage) {
      return { token: tokenStorage, user: JSON.parse(userStorage) };
    }

    return {} as AuthState;
  }, []);

  const [data, setData] = useState<AuthState>(getInitialState());

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<LoginResponse>('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    await api.post('/users', { name, email, password });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};

export { AuthProvider, useAuth };
