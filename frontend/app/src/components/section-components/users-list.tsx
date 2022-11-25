import UsersListItem from './users-list-item';
import type { channelRole, User, UserListType } from '../global-components/interface';

function UsersList({
  users,
  userListType,
  roles,
  channelId
}: {
  users: User[];
  userListType: UserListType;
  roles?: {
    userId: string;
    role: channelRole;}[];
  channelId?: string;
}) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users
      .sort((a, b) => (a.nickname.toLowerCase() >= b.nickname.toLowerCase() ? 1 : -1))
      .map((user: User) => (
        <UsersListItem
          key={user.id}
          user={user}
          userListType={userListType}
          role={(roles?.find((role) => role.userId === user.id)?.role)}
          channelId={channelId}
        />
      ))}
    </div>
  );
}

export default UsersList;
