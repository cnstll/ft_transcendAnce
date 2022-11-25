import {
  channelType,
  User,
  UserListType,
} from '../../global-components/interface';
import UsersList from '../users-list';

interface MembersListProps {
  channelUsers: User[];
  user: User;
  type: channelType;
}

function MembersList({ channelUsers, user, type }: MembersListProps) {
  return (
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
      type={type}
    />
  );
}

export default MembersList;
