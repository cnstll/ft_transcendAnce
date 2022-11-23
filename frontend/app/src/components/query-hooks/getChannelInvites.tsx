import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { apiUrl, User } from "../global-components/interface";

const fetchInvitesOfAChannel = (channelId: string) =>
axios
  .get<User[]>(`${apiUrl}/channels/get-invites/`+ channelId, {
    withCredentials: true,
  })
  .then((res) => res.data);

export function useInvitesOfAChannel(channelId: string):
UseQueryResult<User[] | undefined> {
  return useQuery(['invitesOfAChannel', channelId], () =>
  fetchInvitesOfAChannel(channelId));
}

const fetchInvitableUsers = (channelId: string) =>
axios
  .get<User[]>(`${apiUrl}/channels/get-invitable-users/`+ channelId,{
    withCredentials: true,
  })
  .then((res) => res.data);

export function getInvitableUsers(channelId: string):
UseQueryResult<User[] | undefined> {
  return useQuery(['invitableUsers', channelId], () =>
  fetchInvitableUsers(channelId));
}

