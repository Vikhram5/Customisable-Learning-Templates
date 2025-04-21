import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  
  //console.log("User:", user); 
  
  // Check if the user is logged in and has the correct role
  if (!user) return <Navigate to="/" />;

  // Check if user's loginId is included in allowedRoles
  if (allowedRoles.includes(user.loginId)) {
    return element;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;