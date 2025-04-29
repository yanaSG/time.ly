import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokens';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const internalConfig = config as InternalAxiosRequestConfig;
  const token = getAccessToken();
  if (token && internalConfig.headers) {
    internalConfig.headers.Authorization = `Bearer ${token}`;
  }
  return internalConfig;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        
        // Use your existing auth service or make direct API call
        const { data } = await api.post<{ access: string }>('/token/refresh/', { 
          refresh: refreshToken 
        });
        
        setTokens({
          access: data.access,
          refresh: refreshToken // Keep the same refresh token
        });
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login/';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;