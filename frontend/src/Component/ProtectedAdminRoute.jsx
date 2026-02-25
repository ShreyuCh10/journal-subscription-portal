import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null; // or a loader

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;