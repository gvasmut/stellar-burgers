import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (isAuthenticated && onlyUnAuth) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
