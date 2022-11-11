import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { User } from '../global-components/interface';

const fetchUserNickname = () =>
  axios
    .get<User>(`http://${process.env.REACT_APP_BACKEND_URL}/user/get-user-info`, {
      withCredentials: true,
    })
    .then((res) => res.data.nickname);

function getUserNickname(): UseQueryResult<string> {
  return useQuery('nickname', fetchUserNickname);
}

export default getUserNickname;
