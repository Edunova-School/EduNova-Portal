import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../lib/api";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}