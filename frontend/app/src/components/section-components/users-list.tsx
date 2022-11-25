import UsersListItem from './users-list-item';
import type { channelRole, User, UserListType } from '../global-components/interface';

function UsersList({
  users,
  userListType,
  roles
}: {
  users: User[];
  userListType: UserListType;
  roles?: {
    userId: string;
    role: channelRole;}[];
}) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users.map((user: User) => (
        <UsersListItem key={user.id} user={user} userListType={userListType} role={(roles?.find((role) => role.userId === user.id)?.role)} />
      ))}
    </div>
  );
}

export default UsersList;
