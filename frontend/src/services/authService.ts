import axios from 'axios';
import { getAccessToken, getRefreshToken } from '../utils/tokens'; // Adjust the import path as necessary


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

const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}login/`, { username, password });
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('token');
};

const register = async (userData: RegisterData) => {
  const response = await axios.post<LoginResponse>(`${API_URL}register/`, userData);
  return response.data;
};

const updateProfile = async (profileCardData: FormData): Promise<LoginResponse> => {
  const token = getAccessToken();
  const response = await axios.put<LoginResponse>(`${API_URL}register/profile/`, 
    profileCardData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

const getUserProfile = async (): Promise<any> => {
  const token = getAccessToken();
  const response = await axios.get(`${API_URL}profile/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};


export default {
  login,
  logout,
  register,
  updateProfile,
  getUserProfile
};