import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'
import { Channel } from "../global-components/interface";

const postChannelRequest =
  (channel: {name: string, type? : 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE', passwordHash?: string}) =>
  axios
    .post<Channel>(
      'http://localhost:3000/channels/create',
      channel,
      { withCredentials: true },
      )
      .then((res) => res.data);

export default function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation((channel: {name: string, type? : 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECTMESSAGE', passwordHash?: string}) =>
    postChannelRequest(channel),
    {
      onSuccess: () => queryClient.refetchQueries(['groupChannelsList']),
    }
  );
}
