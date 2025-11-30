import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type UnprotectedRouteProps = {
  children: ReactNode;
};

const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    return <Navigate to='/profile' replace />;
  }

  return <>{children}</>;
};

export default UnprotectedRoute;
