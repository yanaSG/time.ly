import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import userService from '../services/userService';
import { Notebook } from '../types/Notebook'; // Assuming Notebook type is defined here or imported

// Define the PinnedNotebook interface
interface PinnedNotebook {
  id: number;
  notebook: Notebook; // Nested Notebook object
  notebook_id: number; // For sending to backend when pinning
  order: number;
}

// Define the PostItNote interface
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
  last_login_date?: string; // Added for streak
  login_streak?: number; // Added for streak
  activity_heatmap?: { [key: string]: number }; // Added for heatmap
  pinned_notebooks?: PinnedNotebook[]; // Added for pinned notebooks
  post_it_note?: PostItNote; // Added for post-it note
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
      setToken(response.access); // Update token state to trigger refreshUser
      // The user object in the response might contain updated streak/heatmap, but refreshUser will get the full profile
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
      // Check if a note already exists for the user
      if (user?.post_it_note) {
        // If it exists, update it
        const updatedNote = await authService.updatePostItNote(content, user.post_it_note.title);
        setUser(prevUser => prevUser ? { ...prevUser, post_it_note: updatedNote } : null);
      } else {
        // If it doesn't exist, create it
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
      // If refresh fails, clear tokens and navigate to login
      logout();
    }
  }, []);

  const updateUserActivity = async (date: string, duration_minutes: number) => {
  try {
    await userService.updateUserActivity(date, duration_minutes);
    // Optionally refresh user profile to get updated heatmap immediately
    await refreshUser();
  } catch (error) {
    console.error('Failed to update user activity:', error);
    // Handle error, e.g., show a notification
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