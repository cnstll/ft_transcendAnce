import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { apiUrl, channelActionType } from '../global-components/interface';

const fetchUsersUnderModerationAction = (
  channelId: string,
  actionType: channelActionType,
) =>
  axios
    .get<string[]>(
      `${apiUrl}/channels/get-users-under-moderation-action/${channelId}/${actionType}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data);

export function useGetUsersUnderModerationAction(
  channelId: string,
  actionType: channelActionType,
  activateQuery: boolean,
): UseQueryResult<string[] | undefined> {
  return useQuery(
    ['getUsersUnderModerationAction', channelId, actionType],
    () => fetchUsersUnderModerationAction(channelId, actionType),
    { enabled: activateQuery },
  );
}
