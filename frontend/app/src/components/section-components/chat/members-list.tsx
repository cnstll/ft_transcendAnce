import {
  channelRole,
  User,
  UserListType,
} from '../../global-components/interface';
import UsersList from '../users-list';
import { useContext, useEffect } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import { socket } from 'src/components/global-components/client-socket';
import { useChannelRoles } from 'src/components/query-hooks/useGetChannels';
import { channelContext } from '../../global-components/chat';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}

function MembersList({
  channelUsers,
  user,
  setActiveChannelId,
}: MembersListProps) {
  const activeChannelCtx = useContext(channelContext);
  const customToastId = 'custom-toast-error-role';
  const channelRolesQueryKey = 'rolesInChannel';
  const myRoleQueryKey = 'myRoleInChannel';
  const queryClient = useQueryClient();
  const roleUsers: UseQueryResult<
    | {
        userId: string;
        role: channelRole;
      }[]
    | undefined
  > = useChannelRoles(activeChannelCtx.id);

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
        setActiveChannelId={setActiveChannelId}
      />
    </>
  );
}

export default MembersList;
