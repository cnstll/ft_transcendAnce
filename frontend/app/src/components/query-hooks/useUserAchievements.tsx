import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import type { AchievementData } from '../global-components/interface';
import { apiUrl } from '../global-components/interface';

const fetchUserAchievements = (nickname: string) =>
  axios
    .post<AchievementData[]>(
      `${apiUrl}/user/get-achievement`,
      { userNickname: nickname },
      {
        withCredentials: true,
      },
    )
    .then((response) => response.data);

function useUserAchievements(
  nickname: string,
  eloScore: number,
  twoFaSet: boolean,
): UseQueryResult<AchievementData[]> {
  return useQuery(['userAchievements', nickname, eloScore, twoFaSet], () =>
    fetchUserAchievements(nickname),
  );
}

export default useUserAchievements;
