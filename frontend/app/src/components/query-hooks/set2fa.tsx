import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';

const generate = () =>
  axios
    .post(
      `http://${process.env.REACT_APP_BACKEND_URL}/2fa/generate`,
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
    .delete(`http://${process.env.REACT_APP_BACKEND_URL}/2fa/disable`, {
      withCredentials: true,
    })
    .then((res) => res);

export function disable2fa(): UseMutationResult<AxiosResponse> {
  return useMutation(disable);
}

const putValidationCode = (input: string) =>
  axios
    .post(
      `http://${process.env.REACT_APP_BACKEND_URL}/2fa/validate`,
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
      `http://${process.env.REACT_APP_BACKEND_URL}/2fa/authenticate`,
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
