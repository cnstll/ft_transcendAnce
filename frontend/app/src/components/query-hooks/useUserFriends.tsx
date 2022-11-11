import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { User } from '../global-components/interface';

const fetchUserFriends = () =>
  axios
    .get<User[]>(`http://${process.env.REACT_APP_BACKEND_URL}/user/get-user-friends`, {
      withCredentials: true,
    })
    .then((res) => res.data);

function useUserFriends(): UseQueryResult<User[]> {
  return useQuery('friendsList', fetchUserFriends);
}

export default useUserFriends;
