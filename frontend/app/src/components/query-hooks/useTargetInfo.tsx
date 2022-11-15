import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { TargetInfo } from '../global-components/interface';

const fetchTargetInfo = (targetNickname: string | undefined) =>
  axios
    .post<TargetInfo>(
      'http://localhost:3000/user/get-target-info',
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
