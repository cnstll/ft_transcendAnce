import UsersListItem from "./users-list-item";
import { User } from "../global-components/chat"

type UsersListProps = {
  channelUsers: User[];
}

function UsersList( { channelUsers }: UsersListProps ) {
  return (
    <ul className="text-white text-base">
      {channelUsers.map((user) => (
        <UsersListItem
          key={user.id}
          channelUser={user}
          />
      ))}
    </ul>
  );
}

export default UsersList;
