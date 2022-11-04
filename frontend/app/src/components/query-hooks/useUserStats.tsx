import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { Stats } from '../global-components/interface';

const fetchUserStats = () =>
  axios
    .get<Stats>('http://localhost:3000/user/get-user-matches-stats', {
      withCredentials: true,
    })
    .then((response) => response.data);

function useUserStats(): UseQueryResult<Stats> {
  return useQuery('userStats', fetchUserStats);
}

export default useUserStats;
