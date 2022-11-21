import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, Message } from '../global-components/interface';

const getAllMessages = (channelId: string) =>
  axios
    .get<Message[]>(
      `${apiUrl}/channels/get-messages-from-channel/${channelId}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useGetAllMessages(
  channelId: string,
): UseQueryResult<Message[] | undefined> {
  return useQuery(['getAllMessages', channelId], () =>
    getAllMessages(channelId),
  );
}
