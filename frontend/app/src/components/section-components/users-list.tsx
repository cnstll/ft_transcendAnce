import UsersListItem from "./users-list-item";

function UsersList(props) {
  return (
    <div className="flex flex-col gap-4 text-base my-4">
      {props.channelUsers.map((channelUser) => (
        <UsersListItem
          key={channelUser.id}
          id={channelUser.id}
          image={channelUser.image}
          nickname={channelUser.nickname}
          status={channelUser.status}
          />
      ))}
    </div>
  );
}

export default UsersList;
