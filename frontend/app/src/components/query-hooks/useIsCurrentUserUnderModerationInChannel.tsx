import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, channelActionType } from '../global-components/interface';

const fetchIsCurrentUserUnderModeration = (
  channelId: string,
  actionType: channelActionType,
) =>
  axios
    .get<string[]>(
      `${apiUrl}/channels/get-is-current-user-under-moderation/${channelId}/${actionType}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useIsCurrentUserUnderModerationInChannel(
  channelId: string,
  actionType: channelActionType,
  activateQuery: boolean,
): UseQueryResult<boolean | undefined> {
  return useQuery(
    ['isCurrentUserUnderModeration', channelId, actionType],
    () => fetchIsCurrentUserUnderModeration(channelId, actionType),
    { enabled: activateQuery },
  );
}
