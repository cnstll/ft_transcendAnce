import UsersListItem from './users-list-item';
import type { User } from '../global-components/interface';

function UsersList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {users.map((user: User) => (
        <UsersListItem key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UsersList;
