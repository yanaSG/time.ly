import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import userService from '../services/userService';
import { Notebook } from '../types/Notebook';

interface PinnedNotebook {
  id: number;
  notebook: Notebook;
  notebook_id: number;
  order: number;
}

interface PostItNote {
  title: string;
  text_content: string;
  created_at: string;
  updated_at: string;
}

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
  last_login_date?: string;
  login_streak?: number;
  activity_heatmap?: { [key: string]: number };
  pinned_notebooks?: PinnedNotebook[]; 
  post_it_note?: PostItNote;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (data: {username: string, password: string}) => Promise<void>;
  logout: () => void;
  register: (data: { username: string; fname: string; lname: string; email: string; password: string; password2: string }) => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  getUserDetails: () => Promise<any>;
  refreshUser: () => Promise<void>;
  updatePostItNote: (content: string) => Promise<void>;
  updateUserActivity: (date: string, duration_minutes: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const navigate = useNavigate();

  const login = async (data: {username: string, password: string}) => {
    try {
      const response = await authService.login(data.username, data.password);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      setToken(response.access);
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: { username: string; fname: string; lname: string; email: string; password: string; password2: string }) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: FormData) => {
    try {
      await authService.updateProfile(data);
      await refreshUser();
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const updatePostItNote = async (content: string) => {
    try {
      if (user?.post_it_note) {
        const updatedNote = await authService.updatePostItNote(content, user.post_it_note.title);
        setUser(prevUser => prevUser ? { ...prevUser, post_it_note: updatedNote } : null);
      } else {
        const newNote = await authService.createPostItNote(content);
        setUser(prevUser => prevUser ? { ...prevUser, post_it_note: newNote } : null);
      }
    } catch (error) {
      console.error('Post-it note update failed:', error);
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setToken('');
    navigate('/login');
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getUserProfile();
      setUser(response);
    } catch (error) {
      setUser(null);
      console.error('Failed to refresh user profile:', error);
      logout();
    }
  }, []);

  const updateUserActivity = async (date: string, duration_minutes: number) => {
  try {
    await userService.updateUserActivity(date, duration_minutes);
    await refreshUser();
  } catch (error) {
    console.error('Failed to update user activity:', error);
  }
};

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setUser(null);
    }
  }, [token, refreshUser]);

  const getUserDetails = async () => {
    try {
      const details = await authService.getUserProfile();
      return details;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      updateProfile,
      getUserDetails,
      refreshUser,
      updatePostItNote,
      updateUserActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };