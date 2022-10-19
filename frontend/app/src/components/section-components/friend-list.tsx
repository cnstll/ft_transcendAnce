import UsersList from './users-list'
import useUserFriends from '../customed-hooks/useUserFriends'
import { User } from '../global-components/interface';

function FriendsList() {

  const friends = useUserFriends();

  return <>
    {friends.isLoading && <p>Loading users...</p>}
    {friends.isError && <p>Could not fetch users...</p>}
    {friends.isSuccess && <UsersList channelUsers={friends.data as User[]} />}
  </>
}

export default FriendsList;
