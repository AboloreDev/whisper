export interface User {
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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
