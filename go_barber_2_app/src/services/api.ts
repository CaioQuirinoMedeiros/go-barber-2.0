import axios, { AxiosResponse } from 'axios';

import * as ApiTypes from './api.types';

const createApi = () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333',
  });

  const setToken = (token: string) => {
    axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
  };

  const removeToken = () => {
    axiosInstance.defaults.headers.authorization = undefined;
  };

  const signup = (signupParams: ApiTypes.SignupParams) => {
    const { name, email, password } = signupParams;
    return axiosInstance.post('users', { name, email, password });
  };

  const login = (loginParams: ApiTypes.LoginParams) => {
    const { email, password } = loginParams;

    return new Promise<AxiosResponse<ApiTypes.LoginResponse>>(
      (resolve, reject) => {
        axiosInstance
          .post<ApiTypes.LoginResponse>('sessions', { email, password })
          .then(response => {
            setToken(response.data.token);
            resolve(response);
          })
          .catch(reject);
      }
    );
  };

  const getProviders = () => {
    return axiosInstance.get<ApiTypes.ProvidersResponse>('providers');
  };

  return {
    setToken,
    removeToken,
    signup,
    login,
    getProviders,
  };
};

// const api = axios.create({
//   baseURL: 'http://localhost:3333',
// });

export default createApi();
