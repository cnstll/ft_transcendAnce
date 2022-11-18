import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, TargetInfo } from '../global-components/interface';

const fetchTargetInfo = (targetNickname: string | undefined) =>
  axios
    .post<TargetInfo>(
      `${apiUrl}/user/get-target-info`,
      { nickname: targetNickname },
      { withCredentials: true },
    )
    .then((res) => res.data);

export function useTargetInfo(
  targetNickname: string | undefined,
): UseQueryResult<TargetInfo> {
  return useQuery(['targetInfo', targetNickname], () =>
    fetchTargetInfo(targetNickname),
  );
}

const fetchOpponentInfo = (userId: string | undefined) =>
  axios
    .post<TargetInfo>(
      '${apiUrl}/user/get-user-by-id',
      { userId: userId },
      { withCredentials: true },
    )
    .then((res) => res.data);

export function useOpponentInfo(
  userId: string | undefined,
): UseQueryResult<TargetInfo> {
  return useQuery(['opponentInfo', userId], () => fetchOpponentInfo(userId));
}
