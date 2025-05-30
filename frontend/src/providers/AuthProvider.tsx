import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  fname: string;
  lname: string;
  image?: string;
  school?: string;
  course?: string;
  likes?: string;
  bio?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: { username: string; fname: string; lname: string; email: string; password: string; password2: string }) => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  getUserDetails: () => Promise<any>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const navigate = useNavigate();

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await authService.login(data.username, data.password);
      setToken(response.access);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (data: { username: string; fname: string; lname: string; email: string; password: string, password2: string }) => {
    try {
      const response = await authService.register(data);
      setToken(response.access);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      await refreshUser();
      navigate('/setup');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const updateProfile = async (data: FormData) => {
    try {
      await authService.updateProfile(data);
      await refreshUser();
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setToken('');
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getUserProfile();
      setUser(response);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const getUserDetails = async () => {
    try {
      const details = await authService.getUserProfile();
      return details;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, updateProfile, getUserDetails, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };