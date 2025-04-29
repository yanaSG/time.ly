# Project Folder Structure Documentation

This document provides an overview of the folder structure for the project, detailing the purpose of each directory and its contents.

## Folder Structure

    src/
    ├── assets/ # Static files (images, fonts)
    │   └── styles/ # Global CSS/Tailwind config
    │
    ├── components/ # Reusable UI components
    │   ├── ui/ # Atomic components (Input, Modal)
    │   └── layout/ # App-wide layouts (AuthLayout, MainLayout)
    │
    ├── features/ # Feature-based modules (auth, dashboard)
    │   ├── auth/ # Auth-related components/pages
    │   │   ├── Login.jsx # Login page component
    │   │   └── Register.jsx # Registration page component
    │   ├── dashboard/ # Dashboard feature
    │   │   ├── Dashboard.jsx # Main dashboard component
    │   │   └── components/ # Feature-specific components for the dashboard
    │   └── landing/ # Landing page feature
    │       └── Landing.jsx # Landing page component
    │
    ├── hooks/ # Custom hooks (useAuth, useFetch)
    │
    ├── lib/ # Configuration files (axios, Firebase)
    │
    ├── pages/ # Deprecated (if using feature-based structure)
    │
    ├── providers/ # Context providers (AuthProvider, ThemeProvider)
    │
    ├── routes/ # All routing logic
    │   ├── AppRouter.jsx # Main router component (with lazy loading)
    │   └── routes.js # Route definitions (clean mapping)
    │
    ├── utils/ # Helper functions (api.js, formatters)
    │
    ├── App.jsx # Main application component (app-wide providers/wrappers)
    └── main.jsx # React entry point


## Directory Descriptions

### `assets/`
Contains static files such as images and fonts. The `styles/` subdirectory holds global CSS files and Tailwind configuration.

### `components/`
Houses reusable UI components that can be utilized throughout the application.
- **`ui/`**: Contains atomic components like buttons, inputs, and modals.
- **`layout/`**: Contains layout components that define the structure of different pages, such as authentication and main layouts.

### `features/`
Organized by feature, this directory contains modules that encapsulate related components and logic.
- **`auth/`**: Contains components related to user authentication, including login and registration pages.
- **`dashboard/`**: Contains components and subcomponents related to the dashboard feature.
- **`landing/`**: Contains the landing page component and any related subcomponents.

### `hooks/`
Contains custom React hooks that encapsulate reusable logic, such as authentication and data fetching.

### `pages/`
**Deprecated**: This directory was previously used for page components but is no longer recommended if using a feature-based structure.

### `providers/`
Contains context providers that wrap the application, allowing for global state management (e.g., authentication and theme).

### `routes/`
Contains all routing logic for the application.
- **`AppRouter.jsx`**: The main router component that handles route definitions and lazy loading of components.
- **`routes.js`**: A clean mapping of route definitions for easy management.

### `utils/`
Contains utility functions and helpers that can be used throughout the application, such as API calls and data formatters.

### `App.jsx`
The main application component that wraps the application with necessary providers and layout components.

### `main.jsx`
The entry point of the React application, where the app is rendered to the DOM.