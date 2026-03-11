import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { user, isLoaded, isSignedIn } = useUser();
const role = user?.publicMetadata?.role;
  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

if (role === "admin") {
  return <Navigate to="/admin-dashboard" replace />;
}

return <Navigate to="/dashboard" replace />;

  if (role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return null;
};

export default RoleRedirect;