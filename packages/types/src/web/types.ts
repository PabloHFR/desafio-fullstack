export interface LoginRequest {
  identifier: string; // email ou username
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
