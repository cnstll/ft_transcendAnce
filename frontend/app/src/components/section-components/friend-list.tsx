import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { socket } from '../global-components/client-socket';
import useUserFriends from '../query-hooks/useUserFriends';
import LoadingSpinner from './loading-spinner';
import UsersList from './users-list';

function FriendsList() {
  const friends = useUserFriends();
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.on('userDisconnected', async () => {
      await queryClient.invalidateQueries('friendsList');
    });
    socket.on('userConnected', async () => {
      console.log('PROFILE - USER CONNECTED');
      await queryClient.invalidateQueries('friendsList');
    });
    socket.on('userInGame', async () => {
      console.log('PROFILE - USER IN GAME');
      await queryClient.invalidateQueries('friendsList');
    });
    socket.on('userGameEnded', async () => {
      console.log('PROFILE - USER GAME ENDED');
      await queryClient.invalidateQueries('friendsList');
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
      {friends.isSuccess && <UsersList users={friends.data} />}
    </>
  );
}

export default FriendsList;
