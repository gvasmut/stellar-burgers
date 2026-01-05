import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useSelector } from '../../services/store';

type UnprotectedRouteProps = {
  children: ReactNode;
};

const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  if (!isAuthChecked) {
    return null;
  }
  if (user) {
    return <Navigate to='/profile' replace />;
  }

  return <>{children}</>;
};

export default UnprotectedRoute;
