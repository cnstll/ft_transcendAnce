import { User, UserListType } from '../../global-components/interface';
import UsersList from '../users-list';

interface MembersListProps {
  channelUsers: User[];
  user: User;
}

function MembersList({ channelUsers, user }: MembersListProps) {
  return (
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
    />
  );
}

export default MembersList;
