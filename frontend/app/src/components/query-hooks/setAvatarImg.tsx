import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const putAvatarImg = (input: FormData) =>
  axios
    .put('http://localhost:3000/user/update-avatarImg', input, {
      withCredentials: true,
    })
    .then((res) => res);

function setAvatarImg(): UseMutationResult<AxiosResponse, unknown, FormData> {
  return useMutation(putAvatarImg);
}

export default setAvatarImg;
