import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchUserNickname = () =>
  axios
    .get<User>(`${apiUrl}/user/get-user-info`, {
      withCredentials: true,
    })
    .then((res) => res.data.nickname);

function getUserNickname(): UseQueryResult<string> {
  return useQuery('nickname', fetchUserNickname);
}

export default getUserNickname;
