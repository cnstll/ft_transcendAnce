import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchChannelUsers = (channelId: string) =>
  axios
    .get<User[]>(`${apiUrl}/channels/get-users-of-a-channel/${channelId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelUsers(
  channelId: string,
  activateQuery: boolean,
): UseQueryResult<User[] | undefined> {
  return useQuery(
    ['channelUsers', channelId],
    () => fetchChannelUsers(channelId),
    { enabled: activateQuery },
  );
}
