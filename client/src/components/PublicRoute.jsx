import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // If authenticated, redirect to dashboard
  return isAuthenticated ? <Navigate to="/app/dashboard" /> : children;
};

export default PublicRoute;
