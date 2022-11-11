import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchUser = () =>
  axios
    .get<User>(`http://${apiUrl}/user/get-user-info`, {
      withCredentials: true,
    })
    .then((response) => response.data);

function useUserInfo(): UseQueryResult<User> {
  return useQuery('userData', fetchUser);
}

export default useUserInfo;
