import UsersListItem from './users-list-item';
import type {
  channelType,
  User,
  UserListType,
} from '../global-components/interface';

interface UsersListProps {
  users: User[];
  userListType: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
}

function UsersList({
  users,
  userListType,
  type,
  setActiveChannelId,
}: UsersListProps) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users
        .sort((a, b) =>
          a.nickname.toLowerCase() >= b.nickname.toLowerCase() ? 1 : -1,
        )
        .map((user: User) => (
          <UsersListItem
            key={user.id}
            user={user}
            userListType={userListType}
            type={type}
            setActiveChannelId={setActiveChannelId}
          />
        ))}
    </div>
  );
}

export default UsersList;
