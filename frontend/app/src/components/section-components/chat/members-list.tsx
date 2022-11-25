import { channelRole, User, UserListType } from '../../global-components/interface';
import UsersList from '../users-list';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  roles?: {
    userId: string;
    role: channelRole;}[];
  channelId: string;
}

function MembersList({ channelUsers, user, roles, channelId }: MembersListProps) {
  return (
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
      roles={roles}
      channelId={channelId}
    />
  );
}

export default MembersList;
