import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { MatchData } from '../global-components/interface';

const fetchUserMatchHistory = (nickname: string) =>
  axios
    .post<MatchData[]>(
      'http://localhost:3000/user/get-user-match-history',
      { userNickname: nickname },
      {
        withCredentials: true,
      },
    )
    .then((response) => response.data);

function useUserMatchHistory(
  nickname: string,
  avatarImg: string,
): UseQueryResult<MatchData[]> {
  return useQuery(['userMatchHistory', nickname, avatarImg], () =>
    fetchUserMatchHistory(nickname),
  );
}

export default useUserMatchHistory;
