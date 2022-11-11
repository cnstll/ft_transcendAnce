import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, Stats } from '../global-components/interface';

const fetchUserStats = (nickname: string) =>
  axios
    .post<Stats>(
      `http://${apiUrl}/user/get-user-matches-stats`,
      { userNickname: nickname },
      {
        withCredentials: true,
      },
    )
    .then((response) => response.data);

function useUserStats(nickname: string): UseQueryResult<Stats> {
  return useQuery(['userStats', nickname], () => fetchUserStats(nickname));
}

export default useUserStats;
