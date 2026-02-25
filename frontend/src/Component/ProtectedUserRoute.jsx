import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedUserRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or a loader
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedUserRoute;