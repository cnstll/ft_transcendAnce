import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const putAvatarImg = (input: FormData) =>
  axios
    .put(`${apiUrl}/user/update-avatarImg`, input, {
      withCredentials: true,
    })
    .then((res) => res);

function setAvatarImg(): UseMutationResult<AxiosResponse, unknown, FormData> {
  return useMutation(putAvatarImg);
}

export default setAvatarImg;
