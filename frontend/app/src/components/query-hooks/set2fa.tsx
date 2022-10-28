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

const set2fa = (input: boolean) =>
  axios
    .put(
      'http://localhost:3000/2fa/toggle',
      { toggleState: input },
      {
        withCredentials: true,
      },
    )
    .then((res) => res);

export function toggle2fa(): UseMutationResult<
  AxiosResponse,
  unknown,
  boolean
> {
  return useMutation(set2fa);
}
