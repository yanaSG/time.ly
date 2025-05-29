import axios, { AxiosInstance} from 'axios';

const createApiClient = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/',
    });

    // Add request interceptor for auth token
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.url && !config.url.endsWith('login/') && !config.url.endsWith('signup/')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Add response interceptor for error handling
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 &&
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/signup') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const api = createApiClient();