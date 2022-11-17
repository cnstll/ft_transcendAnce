import axios, { AxiosResponse } from 'axios';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

const generate = () =>
  axios
    .get<string>('http://localhost:3000/2fa/generate', {
      withCredentials: true,
    })
    .then((response) => response.data);

export function generate2fa(): UseQueryResult<string> {
  return useQuery('QRCode', generate);
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

const postAuthenticate = (input: string) =>
  axios
    .post(
      'http://localhost:3000/2fa/authenticate',
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
