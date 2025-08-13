// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.slice";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? true;

  // Wait until Zustand has loaded from storage
  if (!hasHydrated) {
    return null; // could show a spinner here if you want
  }

  // If not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user role is not in them → unauthorized
  if (
    allowedRoles.length > 0 &&
    !allowedRoles
      .map((r) => r.toLowerCase())
      .includes(user?.role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is allowed → render children
  return <Outlet />;
}
