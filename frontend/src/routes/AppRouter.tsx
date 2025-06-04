import React, { Fragment, Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { ROUTES } from "./routes";
import LoadingSpinner from "../views/components/ui/LoadingSpinner";
import RequireAuth from "./guards/RequireAuth";

//  used to load layouts
const loadComponent = (componentName: string) => {
  return lazy(async () => {
    const module = await import(`../views/components/layout`) as Record<string, React.ComponentType>;
    if (!module[componentName]) {
      throw new Error(`Component "${componentName}" not found in features.`);
    }
    return { default: module[componentName] };
  });
};


// Define the layout components that can be used in the routes
const LAYOUT_COMPONENTS = {
  MainLayout: loadComponent("MainLayout"),
  AuthLayout: loadComponent("AuthLayout"),
} as const;

// Ensure that the layout components are loaded correctly

export default function AppRouter() {
  // Dynamically load layout components based on the route configuration
  const element = useRoutes(
    ROUTES.map(route => {
      // Ensure the route element is a React element
      const Layout = route.layout && route.layout in LAYOUT_COMPONENTS
        ? LAYOUT_COMPONENTS[route.layout as keyof typeof LAYOUT_COMPONENTS]
        : Fragment;

      return {
        // Use React.lazy to load the route element if it's a component
        path: route.path,
        element: (
          // Use Suspense to handle loading states for lazy-loaded components
          <Suspense fallback={<LoadingSpinner />}>
            {/* If the route requires authentication, wrap it in RequireAuth */}
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