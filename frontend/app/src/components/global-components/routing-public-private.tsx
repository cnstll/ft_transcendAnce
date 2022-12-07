import { UseQueryResult } from 'react-query';
import { Navigate } from 'react-router-dom';
import useCheckIsLoggedIn from '../query-hooks/useCheckIsLoggedIn';
import LoadingSpinner from '../section-components/loading-spinner';
import { User } from './interface';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const userInfo: UseQueryResult<User | undefined> = useCheckIsLoggedIn();
  if (userInfo.isSuccess && userInfo.data) {
    return <>{children}</>;
  } else if (userInfo.isLoading) {
    return <LoadingSpinner />;
  } else {
    return <Navigate to="/sign-in" />;
  }
}
