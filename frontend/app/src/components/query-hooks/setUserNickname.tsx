import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const putUserNickname = (input: string) =>
  axios
    .put(
      `${apiUrl}/user/update-nickname`,
      { newNickname: input },
      { withCredentials: true },
    )
    .then((res) => res);

function setUserNickname(): UseMutationResult<AxiosResponse, unknown, string> {
  return useMutation(putUserNickname);
}

export default setUserNickname;
