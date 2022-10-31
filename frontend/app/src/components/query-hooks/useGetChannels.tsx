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

export function useGroupChannelsList(): UseQueryResult<Channel[]> {
  return useQuery('groupChannelsList', fetchAllGroupChannels);
}

const fetchAllChannelsByUserId = () =>
  axios
    .get<Channel[]>('http://localhost:3000/channels/get-by-user-id', {
      withCredentials: true,
  }).then((res) => res.data);

export function useChannelsByUserList(): UseQueryResult<Channel[]> {
  return useQuery('channelsByUserList', fetchAllChannelsByUserId, );
}
