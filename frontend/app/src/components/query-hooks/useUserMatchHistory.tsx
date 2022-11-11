import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { MatchData } from '../global-components/interface';

const fetchUserMatchHistory = (nickname: string) =>
  axios
    .post<MatchData[]>(
      `http://${process.env.REACT_APP_BACKEND_URL}/user/get-user-match-history`,
      { userNickname: nickname },
      {
        withCredentials: true,
      },
    )
    .then((response) => response.data);

function useUserMatchHistory(nickname: string): UseQueryResult<MatchData[]> {
  return useQuery(['userMatchHistory', nickname], () =>
    fetchUserMatchHistory(nickname),
  );
}

export default useUserMatchHistory;
