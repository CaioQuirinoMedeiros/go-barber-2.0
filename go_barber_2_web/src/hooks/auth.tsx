import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';
import { TOKEN_KEY, USER_KEY } from '../constants/auth';

interface AuthContextData {
  user: AuthState['user'];
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signUp(credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  signOut(): void;
  updateUser(user: AuthState['user']): void;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    email: string;
  };
}

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  name: string;
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthState {
  token: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    email: string;
  };
}

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const getInitialState = useCallback(() => {
    const tokenStorage = localStorage.getItem(TOKEN_KEY);
    const userStorage = localStorage.getItem(USER_KEY);

    if (tokenStorage && userStorage) {
      api.defaults.headers.authorization = `Bearer ${tokenStorage}`;
      return { token: tokenStorage, user: JSON.parse(userStorage) };
    }

    return {} as AuthState;
  }, []);

  const [data, setData] = useState<AuthState>(getInitialState());

  const signIn = useCallback(async ({ email, password }: SignInParams) => {
    const response = await api.post<LoginResponse>('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    api.defaults.headers.authorization = `Bearer ${token}`;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: SignUpParams) => {
      await api.post('/users', {
        name,
        email,
        password,
        password_confirmation: password,
      });
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user: AuthState['user']) => {
    setData(oldData => ({ token: oldData.token, user }));

    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
