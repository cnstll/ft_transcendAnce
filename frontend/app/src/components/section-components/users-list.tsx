import UsersListItem from './users-list-item';
import type { User } from '../global-components/chat';

interface UsersListProps {
  channelUsers: User[];
}

function UsersList({ channelUsers }: UsersListProps) {
  return (
    <ul className="text-white text-base">
      {channelUsers.map((user) => (
        <UsersListItem key={user.id} channelUser={user} />
      ))}
    </ul>
  );
}

export default UsersList;
