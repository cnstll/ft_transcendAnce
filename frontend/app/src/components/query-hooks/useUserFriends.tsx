import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchUserFriends = () =>
  axios
    .get<User[]>(`${apiUrl}/user/get-user-friends`, {
      withCredentials: true,
    })
    .then((res) => res.data);

function useUserFriends(): UseQueryResult<User[]> {
  return useQuery('friendsList', fetchUserFriends);
}

export default useUserFriends;
