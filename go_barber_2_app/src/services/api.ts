import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';

import * as ApiTypes from './api.types';

const createApi = () => {
  const axiosInstance = axios.create({
    baseURL: Config.API_URL,
  });

  const setToken = (token: string) => {
    axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
  };

  const removeToken = () => {
    axiosInstance.defaults.headers.authorization = undefined;
  };

  const signup = (signupParams: ApiTypes.SignupParams) => {
    const { name, email, password } = signupParams;
    return axiosInstance.post('users', {
      name,
      email,
      password,
      password_confirmation: password,
    });
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

  const getProviderDayAvailability = (
    params: ApiTypes.ProviderDayAvailabilityParams
  ) => {
    const { providerId, day, month, year } = params;
    return axiosInstance.get<ApiTypes.ProviderDayAvailabilityResponse>(
      `providers/${providerId}/day-availability`,
      { params: { day, month, year } }
    );
  };

  const getProviderMonthAvailability = (
    params: ApiTypes.ProviderMonthAvailabilityParams
  ) => {
    const { providerId, month, year } = params;
    return axiosInstance.get<ApiTypes.ProviderMonthAvailabilityResponse>(
      `providers/${providerId}/month-availability`,
      { params: { month, year } }
    );
  };

  const createAppointment = (params: ApiTypes.CreateAppointmentParams) => {
    const { provider_id, date } = params;

    return axiosInstance.post<ApiTypes.CreateAppointmentResponse>(
      'appointments',
      { provider_id, date }
    );
  };

  const updateProfile = (params: ApiTypes.UpdateProfileParams) => {
    const {
      name,
      email,
      password,
      password_confirmation,
      old_password,
    } = params;

    return axiosInstance.put<ApiTypes.UpdateProfileResponse>('profile', {
      name,
      email,
      password,
      password_confirmation,
      old_password,
    });
  };

  const updateAvatar = (formData: FormData) => {
    return axiosInstance.patch<ApiTypes.UpdateAvatarResponse>(
      'users/avatar',
      formData
    );
  };

  const removerAvatar = () => {
    return axiosInstance.delete('users/avatar');
  };

  const forgotPassword = (email: string) => {
    return axiosInstance.post('password/forgot', { email });
  };

  return {
    setToken,
    removeToken,
    signup,
    login,
    getProviders,
    getProviderMonthAvailability,
    getProviderDayAvailability,
    createAppointment,
    updateProfile,
    updateAvatar,
    removerAvatar,
    forgotPassword,
  };
};

export default createApi();
