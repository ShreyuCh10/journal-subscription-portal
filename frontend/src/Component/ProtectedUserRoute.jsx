import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.publicMetadata?.role !== "user") {
    return <Navigate to="/admin-dashboard" />;
  }

  return children;
};

export default ProtectedUserRoute;