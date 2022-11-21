import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { apiUrl } from '../global-components/interface';

const putValidationCode = (input: string) =>
  axios
    .post(
      `${apiUrl}/2fa/validate`,
      { twoFactorAuthenticationCode: input },
      { withCredentials: true },
    )
    .then((res) => res);

export function validate2faCode(): UseMutationResult<
  AxiosResponse,
  unknown,
  string
> {
  return useMutation(putValidationCode);
}

const postAuthenticate = (input: string) =>
  axios
    .post(
      `${apiUrl}/2fa/authenticate`,
      { twoFactorAuthenticationCode: input },
      { withCredentials: true },
    )
    .then((res) => res);

export function authenticate(): UseMutationResult<
  AxiosResponse,
  unknown,
  string
> {
  return useMutation(postAuthenticate);
}
