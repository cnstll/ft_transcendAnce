import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const generate = () =>
  axios
    .post(
      'http://localhost:3000/2fa/generate',
      {},
      {
        withCredentials: true,
      },
    )
    .then((res) => res);

export function generate2fa(): UseMutationResult<AxiosResponse> {
  return useMutation(generate);
}

const disable = () =>
  axios
    .delete('http://localhost:3000/2fa/disable', {
      withCredentials: true,
    })
    .then((res) => res);

export function disable2fa(): UseMutationResult<AxiosResponse> {
  return useMutation(disable);
}

const putValidationCode = (input: string) =>
  axios
    .post(
      'http://localhost:3000/2fa/validate',
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
