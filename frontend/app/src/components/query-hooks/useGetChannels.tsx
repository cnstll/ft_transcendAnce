import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Channel } from '../global-components/interface';

const fetchAllGroupChannels = () =>
  axios
    .get<Channel[]>(`http://${process.env.REACT_APP_BACKEND_URL}/channels/get-group-channels`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGroupChannelsList(): UseQueryResult<Channel[] | undefined> {
  return useQuery(['groupChannelsList'], fetchAllGroupChannels);
}

const fetchAllChannelsByUserId = () =>
  axios
    .get<Channel[]>(`http://${process.env.REACT_APP_BACKEND_URL}/channels/get-channel-by-user-id`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelsByUserList(): UseQueryResult<Channel[] | undefined> {
  return useQuery('channelsByUserList', fetchAllChannelsByUserId);
}
