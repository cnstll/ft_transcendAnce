import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Message } from '../global-components/interface';

const getAllMessages = (channelId: string) =>
  axios
    .get<Message[]>(
      `http://localhost:3000/channels/get-messages-from-channel/${channelId}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useGetAllMessages(
  channelId: string,
): UseQueryResult<Message[] | undefined> {
  return useQuery(['todos', channelId], () => getAllMessages(channelId));
}
