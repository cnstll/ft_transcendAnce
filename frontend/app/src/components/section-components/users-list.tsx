import UsersListItem from "./users-list-item";

function UsersList(props) {
  return (
    <ul className="text-white text-base">
      {props.channelUsers.map((channelUser) => (
        <UsersListItem
          key={channelUser.id}
          id={channelUser.id}
          image={channelUser.image}
          nickname={channelUser.nickname}
          status={channelUser.status}
          />
      ))}
    </ul>
  );
}

export default UsersList;
