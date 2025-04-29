import React, { createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface AuthContextType {
  user: string;
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: { username: string; fname: string; lname: string; email: string; password: string; password2: string; }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string>('');
  const [_, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await authService.login(data.username, data.password);
      setUser(response.username);
      setToken(response.access);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (data: { username: string; fname: string; lname: string; email: string; password: string, password2: string }) => {
    try {
      const response = await authService.register(data);
      setUser(response.username);
      setToken(response.access);
      localStorage.setItem('token', response.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = () => {
    authService.logout();
    setUser('');
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user ? true : false, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };