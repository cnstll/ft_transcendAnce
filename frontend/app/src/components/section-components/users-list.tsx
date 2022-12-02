import UsersListItem from './users-list-item';
import {
  channelRole,
  channelType,
  User,
  UserListType,
} from '../global-components/interface';

interface UsersListProps {
  users: User[];
  userListType: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  roles?: {
    userId: string;
    role: channelRole;}[];
  channelId?: string;
}

function UsersList(
  {users,
  userListType,
  type,
  setActiveChannelId,
  roles,
  channelId}: UsersListProps
) {
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
            role={channelId? (roles?.find((role) => role.userId === user.id)) : undefined}
            channelId={channelId}
          />
        ))}
    </div>
  );
}

export default UsersList;
