import { Route, Navigate } from "react-router-dom";
import useAuth from "./useAuth";

const ProtectedRoute = ({ element, ...rest }) => {
  const { isAuthenticated, accountType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (accountType !== "company") {
    return <Navigate to="/unauthorized" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
