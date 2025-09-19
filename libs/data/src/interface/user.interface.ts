export interface UserDTO {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserDTO;
}