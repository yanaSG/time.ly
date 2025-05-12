import React, { Fragment, Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { ROUTES } from "./routes";
import LoadingSpinner from "../views/components/ui/LoadingSpinner";
import RequireAuth from "./guards/RequireAuth";

const loadComponent = (componentName: string) => {
  return lazy(async () => {
    const module = await import(`../views/components/layout`) as Record<string, React.ComponentType>;
    if (!module[componentName]) {
      throw new Error(`Component "${componentName}" not found in features.`);
    }
    return { default: module[componentName] };
  });
};

const LAYOUT_COMPONENTS = {
  MainLayout: loadComponent("MainLayout"),
  AuthLayout: loadComponent("AuthLayout"),
} as const;

export default function AppRouter() {
  const element = useRoutes(
    ROUTES.map(route => {
      const Layout = route.layout && route.layout in LAYOUT_COMPONENTS
        ? LAYOUT_COMPONENTS[route.layout as keyof typeof LAYOUT_COMPONENTS]
        : Fragment;

      return {
        path: route.path,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            {route.meta?.requiresAuth ? (
              <RequireAuth>
                <Layout>{route.element}</Layout>
              </RequireAuth>
            ) : (
              <Layout>{route.element}</Layout>
            )}
          </Suspense>
        )
      };
    })
  );

  return element;
}