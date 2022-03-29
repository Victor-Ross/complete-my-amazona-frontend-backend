import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStoreContext } from '../../contexts/storeContext';

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps): any {
  const {
    state: { userInfo },
  } = useStoreContext();

  return userInfo && userInfo.isAdmin ? children : <Navigate to="signin" />;
}
