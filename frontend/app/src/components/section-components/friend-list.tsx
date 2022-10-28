import useUserFriends from '../query-hooks/useUserFriends';
import UsersList from './users-list';

function FriendsList() {
  const friends = useUserFriends();

  return (
    <>
      {friends.isLoading && <p>Loading users...</p>}
      {friends.isError && <p>Could not fetch users...</p>}
      {friends.isSuccess && <UsersList users={friends.data} />}
    </>
  );
}

export default FriendsList;
