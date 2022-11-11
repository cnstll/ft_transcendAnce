import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { RankingData } from '../global-components/interface';

const fetchLeaderboard = () =>
  axios
    .get<RankingData[]>(`http://${process.env.REACT_APP_BACKEND_URL}/user/get-leaderboard`, {
      withCredentials: true,
    })
    .then((response) => response.data);

function useLeaderboard(): UseQueryResult<RankingData[]> {
  return useQuery(['leaderboard'], () => fetchLeaderboard());
}

export default useLeaderboard;
