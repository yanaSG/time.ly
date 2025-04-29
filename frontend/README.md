# Authentication and Routing Documentation

This document provides an overview of the authentication flow and routing setup in the project.

---

## Authentication

### Overview

The authentication system uses React Context (`AuthProvider`) to manage user state and authentication logic. It integrates with the backend API for login, registration, and token management.

### Components and Hooks

#### `AuthProvider`
- **File**: `src/providers/AuthProvider.tsx`
- **Purpose**: Provides authentication context to the application.
- **Key Features**:
  - Manages `user` and `isAuthenticated` state.
  - Handles login, logout, and registration logic.
  - Persists tokens (`access_token` and `refresh_token`) in `localStorage`.

#### `useAuth`
- **File**: `src/hooks/useAuth.tsx`
- **Purpose**: Custom hook to access the authentication context.
- **Usage**:
  ```tsx
  const { user, isAuthenticated, login, logout, register } = useAuth();
  ```

#### `authService`
- **File**: `src/services/authService.ts`
- **Purpose**: Provides API calls for authentication-related actions.
- **Key Methods**:
  - `login(username: string, password: string)`: Logs in the user and returns tokens.
  - `logout()`: Clears tokens from `localStorage`.
  - `register(userData: RegisterData)`: Registers a new user.

#### Token Utilities
- **File**: `src/utils/tokens.ts`
- **Purpose**: Manages token storage and retrieval.
- **Key Methods**:
  - `getAccessToken()`: Retrieves the access token from `localStorage`.
  - `getRefreshToken()`: Retrieves the refresh token from `localStorage`.
  - `setTokens(tokens: Tokens)`: Stores access and refresh tokens in `localStorage`.
  - `clearTokens()`: Removes tokens from `localStorage`.

### Authentication Flow

#### Login
1. User submits credentials via the `Login` component.
2. `authService.login` sends a request to the backend.
3. On success:
   - Updates user state.
   - Stores tokens in `localStorage`.
   - Redirects the user to the dashboard.

#### Registration
1. User submits details via the `Register` component.
2. `authService.register` sends a request to the backend.
3. On success:
   - Updates user state.
   - Stores tokens in `localStorage`.
   - Redirects the user to the dashboard.

#### Logout
- Clears user state and tokens from `localStorage`.
- Redirects the user to the login page.

#### Token Validation
- Tokens are validated on app initialization using the `validateToken` function (optional).
- If invalid, the user is logged out.

---

## Routing

### Overview

The routing system uses `react-router-dom` with lazy loading and guards for protected routes.

### Key Files

#### `AppRouter`
- **File**: `src/routes/AppRouter.tsx`
- **Purpose**: Defines the main routing logic.
- **Features**:
  - Lazy loads components using `React.Suspense`.
  - Wraps protected routes with the `RequireAuth` guard.

#### `routes.ts`
- **File**: `src/routes/routes.ts`
- **Purpose**: Defines the route configuration.
- **Example**:
  ```tsx
  export const ROUTES: AppRoute[] = [
    {
      path: "/",
      element: React.createElement(loadComponent("Landing")),
      layout: "MainLayout",
      meta: { title: "Home" }
    },
    {
      path: "/login",
      element: React.createElement(loadComponent("Login")),
      layout: "AuthLayout",
      meta: { title: "Login" }
    },
    {
      path: "/dashboard",
      element: React.createElement(loadComponent("Dashboard")),
      layout: "MainLayout",
      meta: { requiresAuth: true, title: "Dashboard" }
    }
  ];
  ```

#### `RequireAuth`
- **File**: `src/routes/guards/RequireAuth.tsx`
- **Purpose**: Protects routes requiring authentication.
- **Logic**:
  - Checks `isAuthenticated` from `useAuth`.
  - Redirects to `/login` if unauthenticated.

### Routing Flow

#### Public Routes
- Accessible without authentication (e.g., `/login`, `/register`).
- Use the `AuthLayout`.

#### Protected Routes
- Require authentication (e.g., `/dashboard`).
- Use the `RequireAuth` guard to check authentication.
- Redirect unauthenticated users to `/login`.

#### Layouts
- **MainLayout**: For authenticated routes like the dashboard.
- **AuthLayout**: For public routes like login and registration.

---

## Interceptors

### Overview

Interceptors handle API requests and responses globally using Axios. They:
- Attach the Authorization header with the access token.
- Refresh tokens on a 401 Unauthorized response.

### Implementation

#### Request Interceptor
- **File**: `src/utils/api.ts`
- **Purpose**: Attaches the Authorization header with the access token.
- **Logic**:
  ```tsx
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

#### Response Interceptor
- **File**: `src/utils/api.ts`
- **Purpose**: Refreshes tokens on 401 responses and retries the request.
- **Logic**:
  ```tsx
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token');
          
          const { data } = await api.post('/token/refresh/', { refresh: refreshToken });
          setTokens({ access: data.access, refresh: refreshToken });
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
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
  ```

### How It Works

1. **Request Interceptor**:
   - Checks for an access token in `localStorage`.
   - Adds the Authorization header to outgoing requests.

2. **Response Interceptor**:
   - On a 401 response, attempts to refresh the token.
   - If successful:
     - Stores the new access token.
     - Retries the original request.
   - If unsuccessful:
     - Clears tokens.
     - Redirects the user to the login page.