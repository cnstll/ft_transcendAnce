import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const getBlockedUsers = (userId: string) =>
  //Check if the targeted user is blocked
  void axios
    .post<boolean>(
      `${apiUrl}/user/check-current-user-blocked-target`,
      { targetId: userId },
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useBlockedUser(userId: string): UseQueryResult<boolean> {
  return useQuery(['blockedUsers', userId], () => getBlockedUsers(userId));
}

const getBlockedUsersViceVersa = (userId: string) =>
  //Check if the targeted user is blocked
  void axios
    .post<boolean>(
      `${apiUrl}/user/check-user-is-blocked`,
      { targetId: userId },
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useBlockedUserViceVersa(
  userId: string,
): UseQueryResult<boolean> {
  return useQuery(['blockedUsersViceVersa', userId], () =>
    getBlockedUsersViceVersa(userId),
  );
}

export default useBlockedUser;
