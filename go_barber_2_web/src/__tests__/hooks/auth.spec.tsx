import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';
import { TOKEN_KEY, USER_KEY } from '../../constants/auth';

const apiMock = new MockAdapter(api);

const user = {
  email: 'email@example.com',
  name: 'Joao',
  id: '1',
  avatar_url: 'http://avatar.url.com',
};
const token = 'any-token';

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('sessions').reply(200, {
      user,
      token,
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    result.current.signIn({
      email: user.email,
      password: '123456',
    });

    await waitForNextUpdate();

    expect(result.current.user.email).toBe(user.email);

    expect(setItemSpy).toHaveBeenCalledWith(TOKEN_KEY, token);
    expect(setItemSpy).toHaveBeenCalledWith(USER_KEY, JSON.stringify(user));
  });

  it('should restore saved auth data from storage on init', async () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(key => {
        switch (key) {
          case USER_KEY:
            return JSON.stringify(user);
          case TOKEN_KEY:
            return token;
          default:
            return null;
        }
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(getItemSpy).toHaveBeenCalledWith(TOKEN_KEY);
    expect(getItemSpy).toHaveBeenCalledWith(USER_KEY);

    expect(result.current.user.email).toBe(user.email);
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case USER_KEY:
          return JSON.stringify(user);
        case TOKEN_KEY:
          return token;
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledWith(TOKEN_KEY);
    expect(removeItemSpy).toHaveBeenCalledWith(USER_KEY);

    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    act(() => {
      result.current.updateUser(user);
    });

    expect(result.current.user).toEqual(user);

    expect(setItemSpy).toHaveBeenCalledWith(USER_KEY, JSON.stringify(user));
  });
});
