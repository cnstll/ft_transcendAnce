import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const getBlockedUsers = () =>
  axios
    .get<string[]>(`${apiUrl}/block/users-blocked-by-current-user`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGetBlockedUsers(): UseQueryResult<string[]> {
  return useQuery('blockedUsersList', getBlockedUsers);
}

const getUsersWhoBlocked = () =>
  axios
    .get<string[]>(`${apiUrl}/block/users-who-blocked-current-user`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGetUsersWhoBlocked(): UseQueryResult<string[]> {
  return useQuery('usersWhoBlockedList', getUsersWhoBlocked);
}
