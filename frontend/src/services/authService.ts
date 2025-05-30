import { AxiosRequestConfig } from 'axios';
import { api } from '../api/client';

// const API_URL = 'http://127.0.0.1:8000/api/';

interface LoginResponse {
  user : {
    id: number;
    username: string;
  }
  access: string;
  refresh: string;
}

interface RegisterData {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  password2: string;
  // added null fields to match the backend requirements
  // image: null;
  // course: null;
  // school: null;
  // likes: null
  
}

// interface ProfileCardData {
//   image: File | null;
//   school: string;
//   course: string;
//   likes: BigInt;
// }

const login = async (username: string, password: string, config?: AxiosRequestConfig): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(`login/`, { username, password }, config);
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const register = async (userData: RegisterData, config?: AxiosRequestConfig) => {
  const response = await api.post<LoginResponse>(`register/`, userData, config);
  return response.data;
};

const updateProfile = async (profileCardData: FormData, config?: AxiosRequestConfig): Promise<LoginResponse> => {
  const response = await api.put<LoginResponse>(`register/profile/`, profileCardData, config);
  return response.data;
};

const getUserProfile = async (config?: AxiosRequestConfig): Promise<any> => {
  const response = await api.get(`profile/`, config);
  return response.data;
};

export default {
  login,
  logout,
  register,
  updateProfile,
  getUserProfile
};