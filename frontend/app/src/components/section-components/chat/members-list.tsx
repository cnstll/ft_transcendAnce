import {
  channelRole,
  User,
  UserListType,
  Channel,
  channelType,
} from '../../global-components/interface';
import UsersList from '../users-list';
import { useEffect } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import { socket } from 'src/components/global-components/client-socket';
import {
  getCurrentChannel,
  useChannelRoles,
} from 'src/components/query-hooks/useGetChannels';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  type: channelType;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
  channelId: string;
}

function MembersList({
  channelUsers,
  user,
  channelId,
  setActiveChannelId,
}: MembersListProps) {
  const customToastId = 'custom-toast-error-role';
  const channelRolesQueryKey = 'rolesInChannel';
  const myRoleQueryKey = 'myRoleInChannel';
  const currentChannel: UseQueryResult<Channel | undefined> =
    getCurrentChannel(channelId);

  const queryClient = useQueryClient();

  const roleUsers: UseQueryResult<
    | {
        userId: string;
        role: channelRole;
      }[]
    | undefined
  > = useChannelRoles(channelId);

  useEffect(() => {
    socket.on('roleUpdated', async () => {
      await queryClient.refetchQueries(channelRolesQueryKey);
      await queryClient.invalidateQueries(myRoleQueryKey);
    });
    socket.on('updateRoleFailed', () => {
      toast.error("Couldn't update the user's role", {
        toastId: customToastId,
        position: toast.POSITION.TOP_RIGHT,
      });
    });
    return () => {
      socket.off('roleUpdated');
      socket.off('updateRoleFailed');
    };
  }, [queryClient]);

  return (
    <>
      <UsersList
        users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
        userListType={UserListType.MEMBERS}
        roles={roleUsers.data}
        channelId={channelId}
        type={currentChannel.data?.type}
        setActiveChannelId={setActiveChannelId}
      />
    </>
  );
}

export default MembersList;
