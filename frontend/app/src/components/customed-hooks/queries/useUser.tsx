import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { User } from '../../global-components/interface';

const fetchUser = () =>
  axios
    .get<User>('http://localhost:3000/user/get-user-info', {
      withCredentials: true,
    })
    .then((response) => response.data);

function useUser(): UseQueryResult<User> {
  return useQuery('userData', fetchUser);
}

export default useUser;
