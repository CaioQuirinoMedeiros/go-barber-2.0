import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Login from '../../pages/Login';

const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

describe('Login Page', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
  });

  it('should be able to sign in', async () => {
    const email = 'test@email.com';
    const password = 'password';

    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({ email, password });
    });

    expect(mockedAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    );
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const email = 'invalid-email';
    const password = 'password';

    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedSignIn).not.toHaveBeenCalled();
    });

    expect(mockedAddToast).toHaveBeenCalled();
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error('Login failed');
    });

    const email = 'email@example.com';
    const password = 'password';

    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.click(buttonElement);

    expect(mockedAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' })
    );
  });
});
