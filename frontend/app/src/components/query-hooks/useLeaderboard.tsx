import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, RankingData } from '../global-components/interface';

const fetchLeaderboard = () =>
  axios
    .get<RankingData[]>(`${apiUrl}/user/get-leaderboard`, {
      withCredentials: true,
    })
    .then((response) => response.data);

function useLeaderboard(): UseQueryResult<RankingData[]> {
  return useQuery(['leaderboard'], () => fetchLeaderboard());
}

export default useLeaderboard;
