import UsersList from './users-list'
import useUserFriends from '../customed-hooks/useUserFriends'

function FriendsList() {

  const friends = useUserFriends();

  return <>
    {friends.isLoading && <p>Loading users...</p>}
    {friends.isError && <p>Could not fetch users...</p>}
    {friends.isSuccess && <UsersList channelUsers={friends.data} />}
  </>
}

export default FriendsList;
