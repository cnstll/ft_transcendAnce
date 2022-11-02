import axios from "axios";
import { useQueryClient, useMutation } from 'react-query'
import { Channel, channelType } from "../global-components/interface";

const postChannelRequest =
  (channel: {name: string, type? : channelType, passwordHash?: string}) =>
  axios
    .post<Channel>(
      'http://localhost:3000/channels/create',
      channel,
      { withCredentials: true },
      )
      .then((res) => res.data);

export default function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation((channel: {name: string, type? : channelType, passwordHash?: string}) =>
    postChannelRequest(channel),
    {
      onSuccess: () => queryClient.refetchQueries(['groupChannelsList']),
    },
  );
}
