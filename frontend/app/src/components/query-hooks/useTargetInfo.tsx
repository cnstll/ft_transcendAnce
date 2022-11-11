import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, TargetInfo } from '../global-components/interface';

const fetchTargetInfo = (targetNickname: string | undefined) =>
  axios
    .post<TargetInfo>(
      `http://${apiUrl}/user/get-target-info`,
      { nickname: targetNickname },
      { withCredentials: true },
    )
    .then((res) => res.data);

function useTargetInfo(
  targetNickname: string | undefined,
): UseQueryResult<TargetInfo> {
  return useQuery(['targetInfo', targetNickname], () =>
    fetchTargetInfo(targetNickname),
  );
}

export default useTargetInfo;
