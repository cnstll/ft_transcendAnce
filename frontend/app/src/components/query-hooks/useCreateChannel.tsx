import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'
import { Channel } from "../global-components/interface";

const postChannelRequest =
  (name: string, type? : 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE', password?: string) =>
  axios
    .post<Channel>(
      'http://localhost:3000/channels/create',
      {
        name,
        type,
        password,
      },
      { withCredentials: true },
      )
      .then((res) => res.data);

export default function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation((name: string, type? : 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE', password?: string) => postChannelRequest(name, type, password), {
    onSuccess: () => queryClient.refetchQueries(['groupChannelsList']),
  });
}
