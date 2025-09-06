export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
