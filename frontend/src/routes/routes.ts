import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";

const loadComponent = (componentName: string) => {
  return lazy(async () => {
    const module = await import(`../views/features`) as Record<string, React.ComponentType>;
    if (!module[componentName]) {
      throw new Error(`Component "${componentName}" not found in features.`);
    }
    return { default: module[componentName] };
  });
};

export type AppRoute = RouteObject & {
  meta?: {
    requiresAuth?: boolean;
    title?: string;
  };
  layout?: "MainLayout" | "AuthLayout";
};

export const ROUTES: AppRoute[] = [
  // {
  //   path: "/",
  //   element: React.createElement(loadComponent("Landing")),
  //   layout: "MainLayout",
  //   meta: { title: "Home" }
  // },
  {
    path: "/login",
    element: React.createElement(loadComponent("Login")),
    layout: "AuthLayout",
    meta: { title: "Login" }
  },
  {
    path: "/register",
    element: React.createElement(loadComponent("Register")),
    layout: "AuthLayout",
    meta: { title: "Register" }
  },
  {
    path: "/dashboard",
    element: React.createElement(loadComponent("Dashboard")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Dashboard"
    }
  },
  {
    path: "/notebooks",
    element: React.createElement(loadComponent("Notebooks")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Notebooks"
    }
  },
  {
    path: "/profile",
    element: React.createElement(loadComponent("Profile")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Profile"
    }
  },
  {
    path: "/settings",
    element: React.createElement(loadComponent("Settings")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Settings"
    }
  },
  {
    path: "/note",
    element: React.createElement(loadComponent("Note")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Note"
    }
  },
];

export const NAV_ROUTES: AppRoute[] = [
  {
    path: "/dashboard",
    element: React.createElement(loadComponent("Dashboard")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Dashboard"
    }
  },
  {
    path: "/notebooks",
    element: React.createElement(loadComponent("Notebooks")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Notebooks"
    }
  },
  {
    path: "/profile",
    element: React.createElement(loadComponent("Profile")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Profile"
    }
  },
  {
    path: "/settings",
    element: React.createElement(loadComponent("Settings")),
    layout: "MainLayout",
    meta: {
      // requiresAuth: true,
      title: "Settings"
    }
  },
];