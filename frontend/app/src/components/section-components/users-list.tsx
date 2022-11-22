import UsersListItem from './users-list-item';
import type { User, UserListType } from '../global-components/interface';

function UsersList({
  users,
  userListType,
}: {
  users: User[];
  userListType: UserListType;
}) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users.map((user: User) => (
        <UsersListItem key={user.id} user={user} userListType={userListType} />
      ))}
    </div>
  );
}

export default UsersList;
