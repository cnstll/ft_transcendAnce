import UsersListItem from './users-list-item';
import type { User } from '../global-components/chat';

interface UsersListProps {
  channelUsers: User[];
}

function UsersList({ channelUsers }: UsersListProps) {
  return (
    <div className="flex flex-col text-base my-4 gap-4">
      {channelUsers.map((user) => (
        <UsersListItem key={user.id} channelUser={user} />
      ))}
    </div>
  );
}

export default UsersList;
