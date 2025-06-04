import { AxiosRequestConfig } from 'axios';
import { api } from '../api/client';

interface LoginResponse {
  user: {
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
}

const login = async (username: string, password: string, config?: AxiosRequestConfig): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(`login/`, { username, password }, config);
  return response.data;
};

const register = async (userData: RegisterData, config?: AxiosRequestConfig) => {
  const response = await api.post<any>(`register/`, userData, config);
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

const updatePostItNote = async (textContent: string, title: string = "Untitled Note") => {
  const response = await api.put(`post-it-note/`, { title, text_content: textContent });
  return response.data;
};

const createPostItNote = async (textContent: string, title: string = "Untitled Note") => {
  const response = await api.post(`post-it-note/`, { title, text_content: textContent });
  return response.data;
};

export default {
  login,
  register,
  updateProfile,
  getUserProfile,
  updatePostItNote,
  createPostItNote
};