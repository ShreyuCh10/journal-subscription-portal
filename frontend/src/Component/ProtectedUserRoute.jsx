import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.publicMetadata?.role || "user";

  if (role === "user") {
    return children;
  }

  if (role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return null;
};

export default ProtectedUserRoute;