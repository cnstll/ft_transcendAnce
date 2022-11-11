import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const putAvatarImg = (input: FormData) =>
  axios
    .put(`http:///user/update-avatarImg`, input, {
      withCredentials: true,
    })
    .then((res) => res);

function setAvatarImg(): UseMutationResult<AxiosResponse, unknown, FormData> {
  return useMutation(putAvatarImg);
}

export default setAvatarImg;
