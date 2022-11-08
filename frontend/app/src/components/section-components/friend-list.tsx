import useUserFriends from '../query-hooks/useUserFriends';
import LoadingSpinner from './loading-spinner';
import UsersList from './users-list';

function FriendsList() {
  const friends = useUserFriends();

  return (
    <>
      {friends.isError && <p className='text-base text-gray-400'>We encountered an error 🤷</p>}
      {friends.isLoading && <LoadingSpinner/>}
      {friends.isSuccess && <UsersList users={friends.data} />}
    </>
  );
}

export default FriendsList;
