import {
  channelActionType,
  channelRole,
  ModerationInfo,
  User,
  UserListType,
} from '../../global-components/interface';
import UsersList from '../users-list';
import { useContext, useEffect } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import { socket } from 'src/components/global-components/client-socket';
import {
  useChannelRoles,
  useMyChannelRole,
} from 'src/components/query-hooks/useGetChannels';
import { channelContext } from '../../global-components/chat';
import LoadingSpinner from '../loading-spinner';
import ErrorMessage from '../error-message';

interface MembersListProps {
  channelUsers: UseQueryResult<User[] | undefined>;
  user: User;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}

function MembersList({
  channelUsers,
  user,
  setActiveChannelId,
}: MembersListProps) {
  const activeChannelCtx = useContext(channelContext);
  const roleToastId = 'toast-error-role';
  const banToastId = 'toast-error-ban';

  /* Interface with react query cache data to synchronize on events */
  const queryClient = useQueryClient();
  const channelUserBannedQueryKey = 'getUsersUnderModerationAction';
  const isCurrentUserBannedQueryKey = 'isCurrentUserUnderModeration';
  const channelRolesQueryKey = 'rolesInChannel';
  const myRoleQueryKey = 'myRoleInChannel';
  const isUserBannedQueryKey = 'isUserUnderModeration';
  /* Query Hooks to Fetch Data for the Chat */
  const roleUsers: UseQueryResult<
    | {
        userId: string;
        role: channelRole;
      }[]
    | undefined
  > = useChannelRoles(activeChannelCtx.id);
  useMyChannelRole(activeChannelCtx.id);

  useEffect(() => {
    socket.on('roleUpdated', async () => {
      await queryClient.refetchQueries(channelRolesQueryKey);
      await queryClient.invalidateQueries(myRoleQueryKey);
    });
    socket.on('updateRoleFailed', () => {
      toast.error("Couldn't update the user's role 🤷", {
        toastId: roleToastId,
        position: toast.POSITION.TOP_RIGHT,
      });
    });
    socket.on('banSucceeded', async (banInfo: ModerationInfo) => {
      await queryClient.invalidateQueries([
        isCurrentUserBannedQueryKey,
        banInfo.channelActionOnChannelId,
        channelActionType.Ban,
      ]);
      await queryClient.invalidateQueries([
        channelUserBannedQueryKey,
        banInfo.channelActionOnChannelId,
        channelActionType.Ban,
      ]);
      await queryClient.invalidateQueries([
        isUserBannedQueryKey,
        banInfo.channelActionOnChannelId,
        banInfo.channelActionTargetId,
        channelActionType.Ban,
      ]);
    });
    socket.on('banFailed', (banInfo: string) => {
      if (banInfo === 'userIsAlreadyBanned') {
        toast.error('User already banned', {
          toastId: banToastId,
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('Cannot ban user 🤷', {
          toastId: banToastId,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    return () => {
      socket.off('banSucceeded');
      socket.off('banFailed');
      socket.off('roleUpdated');
      socket.off('updateRoleFailed');
    };
  }, [queryClient]);

  return (
    <>
      {channelUsers.isSuccess && channelUsers.data && (
        <UsersList
          users={channelUsers.data.filter(
            (channelUser) => channelUser.id != user.id,
          )}
          userListType={UserListType.MEMBERS}
          roles={roleUsers.data}
          setActiveChannelId={setActiveChannelId}
        />
      )}
      {channelUsers.isLoading && <LoadingSpinner />}
      {channelUsers.isError && <ErrorMessage />}
    </>
  );
}

export default MembersList;
