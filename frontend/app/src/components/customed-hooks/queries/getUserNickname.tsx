import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { User } from '../../global-components/interface';

const fetchUserNickname = () =>
  axios
    .get<User>('http://localhost:3000/user/get-user-info', {
      withCredentials: true,
    })
    .then((res) => res.data.nickname);

function getUserNickname(): UseQueryResult<string> {
  return useQuery('nickname', fetchUserNickname);
}

export default getUserNickname;
