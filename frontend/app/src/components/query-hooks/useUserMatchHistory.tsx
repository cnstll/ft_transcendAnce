import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, MatchData } from '../global-components/interface';

const fetchUserMatchHistory = (nickname: string) =>
  axios
    .post<MatchData[]>(
      `${apiUrl}/user/get-user-match-history`,
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
