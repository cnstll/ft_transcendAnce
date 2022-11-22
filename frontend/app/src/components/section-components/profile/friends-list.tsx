import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { socket } from '../../global-components/client-socket';
import { UserListType } from '../../global-components/interface';
import useUserFriends from '../../query-hooks/useUserFriends';
import LoadingSpinner from '../loading-spinner';
import UsersList from '../users-list';

function FriendsList() {
  const friends = useUserFriends();
  const queryClient = useQueryClient();
  const friendsListQueryKey = 'friendsList';
  useEffect(() => {
    socket.on('userDisconnected', () => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    socket.on('userConnected', () => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    socket.on('userInGame', () => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    socket.on('userGameEnded', () => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    return () => {
      socket.off('userDisconnected');
      socket.off('userConnected');
      socket.off('userInGame');
      socket.off('userGameEnded');
    };
  }, []);

  return (
    <>
      {friends.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {friends.isLoading && <LoadingSpinner />}
      {friends.isSuccess && (
        <UsersList users={friends.data} userListType={UserListType.FRIENDS} />
      )}
    </>
  );
}

export default FriendsList;
