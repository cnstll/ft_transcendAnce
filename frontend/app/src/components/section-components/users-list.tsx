import UsersListItem from './users-list-item';
import type {
  channelType,
  User,
  UserListType,
} from '../global-components/interface';

function UsersList({
  users,
  userListType,
  type,
}: {
  users: User[];
  userListType: UserListType;
  type?: channelType;
}) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users.map((user: User) => (
        <UsersListItem
          key={user.id}
          user={user}
          userListType={userListType}
          type={type}
        />
      ))}
    </div>
  );
}

export default UsersList;
