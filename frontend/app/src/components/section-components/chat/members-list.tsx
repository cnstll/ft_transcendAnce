import { channelRole, User, UserListType } from '../../global-components/interface';
import UsersList from '../users-list';
import { useEffect } from "react";
import { useQueryClient, UseQueryResult } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import { socket } from 'src/components/global-components/client-socket';
import { useChannelRoles } from 'src/components/query-hooks/useGetChannels';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  channelId: string;
}

function MembersList({ channelUsers, user, channelId }: MembersListProps) {
  const customToastId = "custom-toast-error-role";
  const roleQueryKey = 'rolesInChannel';
  const queryClient = useQueryClient();

  const roleUsers: UseQueryResult<{
    userId: string;
    role: channelRole;}[]
    | undefined> =
  useChannelRoles(channelId);

  useEffect(() => {
    socket.on('roleUpdated', async () => {
      console.log("event");
      await queryClient.invalidateQueries(roleQueryKey);
    });
    socket.on('updateRoleFailed', () => {
      toast.error("Couldn't update the user's role", {
        toastId: customToastId,
        position: toast.POSITION.TOP_RIGHT
      });
    });
    return () => {
      socket.off('roleUpdated');
      socket.off('updateRoleFailed');
    };
  }, []);

  return (
    <>
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
      roles={roleUsers.data}
      channelId={channelId}
    />
    <ToastContainer closeButton={false}/>
    </>
  );
}

export default MembersList;
