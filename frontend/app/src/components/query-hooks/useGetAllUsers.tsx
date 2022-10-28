import axios from "axios";
import { useQuery, UseQueryResult } from 'react-query'
import type { User } from '../global-components/interface';

const fetchAllUsers = () => axios.get<User[]>('http://localhost:3000/user/get-all-users', { withCredentials: true }).then((res) => res.data)

function useUserFriends(): UseQueryResult<User[]> {
  return useQuery('friendsList', fetchAllUsers);
}

export default useUserFriends;
