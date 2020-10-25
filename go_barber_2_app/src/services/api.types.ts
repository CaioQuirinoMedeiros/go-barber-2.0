export type SignupParams = {
  name: string;
  email: string;
  password: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
};

export type LoginResponse = {
  user: UserResponse;
  token: string;
};

export type ProvidersResponse = UserResponse[];

export type ProviderMonthAvailabilityParams = {
  providerId: string;
  year: number;
  month: number;
};

export type ProviderMonthAvailabilityResponse = Array<{
  day: number;
  available: boolean;
}>;

export type ProviderDayAvailabilityParams = {
  providerId: string;
  year: number;
  month: number;
  day: number;
};

export type ProviderDayAvailabilityResponse = Array<{
  hour: number;
  available: boolean;
}>;

export type CreateAppointmentParams = {
  provider_id: string;
  date: Date;
};

export type CreateAppointmentResponse = {
  hour: number;
  available: boolean;
};

export type UpdateProfileParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  old_password: string;
};

export type UpdateProfileResponse = UserResponse;

export type UpdateAvatarResponse = UserResponse;
