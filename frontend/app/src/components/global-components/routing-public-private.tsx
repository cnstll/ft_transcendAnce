import { Navigate } from 'react-router-dom';
import useCheckIsLoggedIn from '../query-hooks/useCheckIsLoggedIn';
import LoadingSpinner from '../section-components/loading-spinner';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const userInfo = useCheckIsLoggedIn();
  if (userInfo.isSuccess) {
    return <>{children}</>;
  } else if (userInfo.isLoading) {
    return <LoadingSpinner />;
  } else {
    return <Navigate to="/sign-in" />;
  }
}
