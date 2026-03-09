import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.publicMetadata?.role;

  if (role === "admin") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default ProtectedAdminRoute;