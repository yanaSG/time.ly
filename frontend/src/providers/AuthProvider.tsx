import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface AuthContextType {
  user: { id: number; username: string } | null;
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: { 
    
    username: string; 
    fname: string; 
    lname: string; 
    email: string; 
    password: string; 
    password2: string;
    
    // added null fields to match the backend requirements
    // image: null; 
    // school: null; 
    // course: null; 
    // likes: null; 

  }) => Promise<void>;
  // Note: The updateProfile function expects a FormData object
  updateProfile: (data: FormData ) => Promise<void>;
  getUserDetails: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{id: number, username: string} | null>(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const navigate = useNavigate();

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await authService.login(data.username, data.password);
      setUser(response.user);
      setToken(response.access);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (data: { 
    username: string; 
    fname: string; 
    lname: string; 
    email: string; 
    password: string, 
    password2: string;

    // added null fields to match the backend requirements

    // image: null, 
    // school: null, 
    // course: null, 
    // likes: null,  

  }) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.access);
      localStorage.setItem('token', response.access);
      navigate('/setup');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Note: The updateProfile function expects a FormData object
  const updateProfile = async (data: FormData) => {
    try {           
      await authService.updateProfile(data);
      navigate('/dashboard');
    }catch (error) {
      console.error('Setup Failed:', error);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken('');
    navigate('/login');
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getUserProfile();
        console.log('Current user:', response);
        setUser(response);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };

    if (token) {
      checkAuthStatus();
    } else {
      setUser(null);
    }
  }, [token]);

  const getUserDetails = async () => {
    try {
      const details = await authService.getUserProfile();
      return details;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user ? true : false, login, logout, register, updateProfile, getUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };