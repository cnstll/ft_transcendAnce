import { useQuery, UseQueryResult } from 'react-query';
import type { User } from '../global-components/interface';
import axios from 'axios';

const fetchAllUsers = () =>
  axios
    .get<User[]>(`http://${process.env.REACT_APP_BACKEND_URL}/user/get-all-users`, {
      withCredentials: true,
    })
    .then((res) => res.data);

function useUserFriends(): UseQueryResult<User[]> {
  return useQuery('allUsers', fetchAllUsers);
}

export default useUserFriends;
