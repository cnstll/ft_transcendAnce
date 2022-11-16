import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Channel, channelRole } from '../global-components/interface';

const fetchAllGroupChannels = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/get-group-channels', {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useGroupChannelsList():
  UseQueryResult<Channel[] | undefined> {
    return useQuery(['groupChannelsList'],
    fetchAllGroupChannels);
}

const fetchAllChannelsByUserId = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/get-channel-by-user-id', {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelsByUserList():
  UseQueryResult<Channel[] | undefined> {
  return useQuery('channelsByUserList',
    fetchAllChannelsByUserId);
}

const fetchMyRoleInChannel = (channelId: string) =>
  axios
    .get<Channel>('http://localhost:3000/channels/get-role-user-channel/' + channelId, {
      withCredentials: true,
  }).then((res) => res.data);

export function useMyChannelByUserId(channelId: string):
  UseQueryResult< { role: channelRole } | undefined > {
  return useQuery(['myRoleInChannel', channelId], () =>
    fetchMyRoleInChannel(channelId));
}
