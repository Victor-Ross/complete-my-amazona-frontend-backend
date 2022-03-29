import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStoreContext } from '../../contexts/storeContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps): any {
  const {
    state: { userInfo },
  } = useStoreContext();

  return userInfo ? children : <Navigate to="signin" />;
}
