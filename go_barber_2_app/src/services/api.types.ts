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
