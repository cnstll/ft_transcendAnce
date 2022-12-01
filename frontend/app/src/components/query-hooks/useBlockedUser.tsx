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

function useBlockedUser(userId: string): UseQueryResult<boolean> {
  return useQuery(['blockedUsers', userId], () => getBlockedUsers(userId));
}

export default useBlockedUser;
