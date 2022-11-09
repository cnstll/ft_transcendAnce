import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { RankingData } from '../global-components/interface';

const fetchLeaderboard = () =>
  axios
    .get<RankingData[]>('http://localhost:3000/user/get-leaderboard', {
      withCredentials: true,
    })
    .then((response) => response.data);

function useLeaderboard(): UseQueryResult<RankingData[]> {
  return useQuery(['leaderboard'], () => fetchLeaderboard(), {
    refetchInterval: 6000,
  });
}

export default useLeaderboard;
