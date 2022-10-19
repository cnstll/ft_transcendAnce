import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const putUserNickname = (input: string) =>
  axios
    .put(
      'http://localhost:3000/user/update-nickname',
      { newNickname: input },
      { withCredentials: true },
    )
    .then((res) => res);

function setUserNickname(): UseMutationResult<
  AxiosResponse<any, any>,
  unknown,
  string,
  unknown
> {
  return useMutation(putUserNickname);
}

export default setUserNickname;
