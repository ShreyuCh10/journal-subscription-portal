import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  const role = user?.publicMetadata?.role;

  if (role === "admin") {
    return <Navigate to="/admin-dashboard" />;
  }

  return <Navigate to="/dashboard" />;
};

export default RoleRedirect;