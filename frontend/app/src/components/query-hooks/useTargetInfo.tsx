import axios from "axios";
import { useQuery, UseQueryResult } from 'react-query'

interface TargetInfo {
  id: string,
  nickname: string,
  avatarImg: string,
  eloScore: string,
  status: string,
  friendStatus: string,
}

const fetchTargetInfo = (targetNickname: string | undefined) => axios.post<TargetInfo>('http://localhost:3000/user/get-target-info', { nickname: targetNickname }, { withCredentials: true }).then((res) => res.data)

function useTargetInfo(targetNickname: string | undefined): UseQueryResult<TargetInfo> {
  return useQuery(['targetInfo'], () => fetchTargetInfo(targetNickname));
}

export default useTargetInfo;
