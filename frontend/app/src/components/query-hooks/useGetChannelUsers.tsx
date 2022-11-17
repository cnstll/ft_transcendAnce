import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../global-components/interface';

const fetchChannelUsers = (channelId: string) =>
  axios
    .get<User[]>(
      `http://localhost:3000/channels/get-users-of-a-channel/${channelId}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useChannelUsers(
  channelId: string,
): UseQueryResult<User[] | undefined> {
  return useQuery(['channelUsers', channelId], () =>
    fetchChannelUsers(channelId),
  );
}
