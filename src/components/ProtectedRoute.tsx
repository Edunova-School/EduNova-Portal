import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getAuthRole } from "../lib/api";

type UserRole = "student" | "staff" | "superadmin";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();
  const role = getAuthRole();

  if (!token) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    if (role === "staff") {
      return <Navigate to="/staff/dashboard" replace />;
    }

    if (role === "student") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}