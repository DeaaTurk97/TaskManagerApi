export interface User {
  id: number;
  username: string;
  role: string;
}

export interface UserCreateDto {
  username: string;
  password: string; 
  role: string;
}

export interface UserUpdateDto {
  username?: string;
  password?: string; 
  role?: string;
}