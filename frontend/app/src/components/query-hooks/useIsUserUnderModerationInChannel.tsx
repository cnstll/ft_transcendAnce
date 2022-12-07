import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, channelActionType } from '../global-components/interface';

const fetchIsCurrentUserUnderModeration = (
  channelId: string,
  userId: string,
  actionType: channelActionType,
) =>
  axios
    .get<string[]>(
      `${apiUrl}/channels/get-is-user-under-moderation/${channelId}/${userId}/${actionType}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useIsUserUnderModerationInChannel(
  channelId: string,
  userId: string,
  actionType: channelActionType,
  activateQuery: boolean,
): UseQueryResult<boolean | undefined> {
  return useQuery(
    ['isUserUnderModeration', channelId, userId, actionType],
    () => fetchIsCurrentUserUnderModeration(channelId, userId, actionType),
    { enabled: activateQuery },
  );
}
