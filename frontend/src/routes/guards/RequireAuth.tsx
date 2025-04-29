import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("IS AUTHENTICATED NOT FOUND")
    console.log(isAuthenticated)
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}