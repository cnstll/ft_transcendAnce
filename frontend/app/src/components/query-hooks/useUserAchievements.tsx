import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { AchievementData } from '../global-components/interface';

const fetchUserAchievements = (nickname: string) =>
  axios
    .post<AchievementData[]>(
      'http://localhost:3000/user/get-achievement',
      { userNickname: nickname },
      {
        withCredentials: true,
      },
    )
    .then((response) => response.data);

function useUserAchievements(
  nickname: string,
): UseQueryResult<AchievementData[]> {
  return useQuery(['userAchievements', nickname], () =>
    fetchUserAchievements(nickname),
  );
}

export default useUserAchievements;
