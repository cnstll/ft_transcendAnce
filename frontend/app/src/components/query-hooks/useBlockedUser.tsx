import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const getUsersWithBlockRelation = () =>
  axios
    .get<string[]>(`${apiUrl}/block/current-user-blocked-relations`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGetBlockRelations(): UseQueryResult<string[]> {
  return useQuery('blockedUsers', getUsersWithBlockRelation);
}

const getBlockedUsers = () =>
  axios
    .get<string[]>(`${apiUrl}/block/users-blocked-by-current-user`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGetBlockedUsers(): UseQueryResult<string[]> {
  return useQuery('blockedUsersList', getBlockedUsers);
}
