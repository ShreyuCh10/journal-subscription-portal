import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/userdashboard" />;
  }

  return children;
};

export default ProtectedAdminRoute;