import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { User } from "../global-components/interface";

const fetchInvitesOfAChannel = (channelId: string) =>
axios
  .get<User[]>('http://localhost:3000/channels/get-invites/' + channelId, {
    withCredentials: true,
  })
  .then((res) => res.data);

export function useInvitesOfAChannel(channelId: string):
UseQueryResult<User[] | undefined> {
  return useQuery(['invitesOfAChannel', channelId], () =>
  fetchInvitesOfAChannel(channelId));
}

const fetchChannelInvites = () =>
axios
  .get<{id: string}[]>('http://localhost:3000/user/get-channel-invites', {
    withCredentials: true,
  })
  .then((res) => res.data);

export function getChannelInvites():
UseQueryResult<{id: string}[] | undefined> {
  return useQuery(['channelInvites'], fetchChannelInvites);
}
