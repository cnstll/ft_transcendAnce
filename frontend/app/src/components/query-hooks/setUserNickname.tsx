import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const putUserNickname = (input: string) =>
  axios
    .put(
      `http://${process.env.REACT_APP_BACKEND_URL}/user/update-nickname`,
      { newNickname: input },
      { withCredentials: true },
    )
    .then((res) => res);

function setUserNickname(): UseMutationResult<AxiosResponse, unknown, string> {
  return useMutation(putUserNickname);
}

export default setUserNickname;
