import { channelRole, User, UserListType } from '../../global-components/interface';
import UsersList from '../users-list';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  roles?: {
    userId: string;
    role: channelRole;}[];
}

function MembersList({ channelUsers, user, roles }: MembersListProps) {
  return (
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
      roles={roles}
    />
  );
}

export default MembersList;
