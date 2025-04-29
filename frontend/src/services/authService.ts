import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

interface LoginResponse {
  username: string;
  access: string;
  refresh: string;
}

interface RegisterData {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
}

const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}login/`, { username, password });
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('token');
};

const register = async (userData: RegisterData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}register/`, userData);
  return response.data;
};

export default {
  login,
  logout,
  register,
};