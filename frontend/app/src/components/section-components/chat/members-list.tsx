import {
  channelType,
  channelRole,
  User,
  UserListType,
} from '../../global-components/interface';
import UsersList from '../users-list';
import { useEffect } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import { socket } from 'src/components/global-components/client-socket';
import {
  useChannelRoles,
} from 'src/components/query-hooks/useGetChannels';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  type: channelType | undefined;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
  channelId: string;
}

function MembersList({
  channelUsers,
  user,
  channelId,
  type,
  setActiveChannelId,
 }: MembersListProps) {
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
  > = useChannelRoles(channelId);

  useEffect(() => {
    socket.on('roleUpdated', async () => {
      await queryClient.invalidateQueries(channelRolesQueryKey);
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
    {type === undefined && <p className='text-gray-300'>No one here</p>}
    {type !== undefined &&
      <UsersList
        users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
        userListType={UserListType.MEMBERS}
        roles={roleUsers.data}
        channelId={channelId}
        type={type}
        setActiveChannelId={setActiveChannelId}
      />
    }
    </>
  );
}

export default MembersList;
