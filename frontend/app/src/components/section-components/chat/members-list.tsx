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
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}

function MembersList({
  channelUsers,
  user,
  type,
  setActiveChannelId,
}: MembersListProps) {
  return (
    <UsersList
      users={channelUsers.filter((channelUser) => channelUser.id != user.id)}
      userListType={UserListType.MEMBERS}
      type={type}
      setActiveChannelId={setActiveChannelId}
    />
  );
}

export default MembersList;
