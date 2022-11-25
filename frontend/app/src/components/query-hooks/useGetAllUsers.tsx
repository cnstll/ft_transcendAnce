import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';
import axios from 'axios';

const fetchAllUsers = () =>
  axios
    .get<User[]>(`${apiUrl}/user/get-all-users`, {
      withCredentials: true,
    })
    .then((res) => res.data);

function useGetAllUsers(): UseQueryResult<User[]> {
  return useQuery('allUsers', fetchAllUsers);
}

export default useGetAllUsers;
