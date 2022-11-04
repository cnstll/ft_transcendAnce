import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { Channel } from "../global-components/interface";

/* NOT USED ATM */
// const fetchAllChannels = () =>
//   axios
//     .get<Channel[]>('http://localhost:3000/channels/', {
//       withCredentials: true,
//   }).then((res) => res.data);

// export function useChannelsList(): UseQueryResult<Channel[]> {
//   return useQuery('channelsList', fetchAllChannels);
// }

const fetchAllGroupChannels = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/get-group-channels', {
      withCredentials: true,
  }).then((res) => res.data);

export function useGroupChannelsList(): UseQueryResult<Channel[] | undefined> {
  return useQuery(['groupChannelsList'], fetchAllGroupChannels);
}

const fetchAllChannelsByUserId = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/get-by-user-id', {
      withCredentials: true,
  }).then((res) => res.data);

export function useChannelsByUserList(): UseQueryResult<Channel[] | undefined> {
  return useQuery('channelsByUserList', fetchAllChannelsByUserId);
}

const fetchMyChannelByUserId = (channelId: string) =>
  axios
    .get<Channel>('http://localhost:3000/channels/get-user-channel/' + channelId, {
      withCredentials: true,
  }).then((res) => res.data);

// Had to define channelId as string or undefined because it's the return of useParams which is defined as such
export function useMyChannelByUserId(channelId: string | undefined): UseQueryResult<{ channel: Channel } | undefined> {
  if (typeof channelId === 'undefined')
    return useQuery(['myChannelByUser', channelId], () => fetchMyChannelByUserId(''));
  return useQuery(['myChannelByUser', channelId], () => fetchMyChannelByUserId(channelId));
}
