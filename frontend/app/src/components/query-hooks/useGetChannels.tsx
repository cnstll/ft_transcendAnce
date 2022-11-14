import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, Channel } from '../global-components/interface';

const fetchAllGroupChannels = () =>
  axios
    .get<Channel[]>(`${apiUrl}/channels/get-group-channels`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGroupChannelsList(): UseQueryResult<Channel[] | undefined> {
  return useQuery(['groupChannelsList'], fetchAllGroupChannels);
}

const fetchAllChannelsByUserId = () =>
  axios
    .get<Channel[]>(`${apiUrl}/channels/get-channel-by-user-id`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelsByUserList(): UseQueryResult<Channel[] | undefined> {
  return useQuery('channelsByUserList', fetchAllChannelsByUserId);
}
