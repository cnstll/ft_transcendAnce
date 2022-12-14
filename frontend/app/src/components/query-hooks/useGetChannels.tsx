import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, Channel, channelRole } from '../global-components/interface';

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
    .get<Channel[]>(`${apiUrl}/channels/get-all-channels-by-user-id`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useChannelsByUserList(): UseQueryResult<Channel[] | undefined> {
  return useQuery('channelsByUserList', fetchAllChannelsByUserId);
}

const fetchCurrentChannel = (channelId: string) =>
  axios
    .get<Channel>(`${apiUrl}/channels/${channelId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function getCurrentChannel(
  channelId: string,
  activateQuery: boolean,
): UseQueryResult<Channel | undefined> {
  return useQuery(
    ['currentChannel', channelId],
    () => fetchCurrentChannel(channelId),
    { enabled: activateQuery },
  );
}

const fetchMyRoleInChannel = (channelId: string) =>
  axios
    .get<channelRole>(`${apiUrl}/channels/get-role-user-channel/${channelId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useMyChannelRole(
  channelId: string,
): UseQueryResult<{ role: channelRole } | undefined> {
  return useQuery(['myRoleInChannel', channelId], () =>
    fetchMyRoleInChannel(channelId),
  );
}

const fetchRolesInChannel = (channelId: string) =>
  axios
    .get<{ userId: string; role: channelRole }[]>(
      `${apiUrl}/channels/get-roles-users-channel/${channelId}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useChannelRoles(
  channelId: string,
): UseQueryResult<{ userId: string; role: channelRole }[]> {
  return useQuery(['rolesInChannel', channelId], () =>
    fetchRolesInChannel(channelId),
  );
}

const getDirectMessageIdBetweenUsers = (targetId: string) =>
  axios
    .post<string>(
      `${apiUrl}/channels/get-direct-message-between-users`,
      {
        targetId: targetId,
      },
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useGetDirectMessageIdBetweenUsers(
  targetId: string,
  activateQuery: boolean,
): UseQueryResult<string> {
  return useQuery(
    ['directMessageId', targetId],
    () => getDirectMessageIdBetweenUsers(targetId),
    { enabled: activateQuery },
  );
}
