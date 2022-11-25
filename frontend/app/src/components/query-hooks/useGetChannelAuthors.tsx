import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, User } from '../global-components/interface';

const fetchChannelAuthors = (channelId: string) =>
  axios
    .get<User[]>(`${apiUrl}/channels/get-authors-from-channel/${channelId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelAuthors(
  channelId: string,
): UseQueryResult<User[] | undefined> {
  return useQuery(['channelAuthors', channelId], () =>
    fetchChannelAuthors(channelId),
  );
}
