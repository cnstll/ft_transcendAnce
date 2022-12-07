import axios from 'axios';
import { useQueryClient } from 'react-query';
import { socket } from 'src/components/global-components/client-socket';
import { useGetBlockedUsers } from 'src/components/query-hooks/useBlockedUser';
import { apiUrl, channelType, User } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

interface BlockUserProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  setBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockUser({ user, setIsShown, setBlocked }: BlockUserProps) {
  const listBlockedUser = useGetBlockedUsers();
  const queryClient = useQueryClient();
  const listUsersBlockedQueryKey = 'blockedUsersList';
  const directMessageIdQueryKey = 'directMessageId';
  const directMessageId = queryClient.getQueryData([
    directMessageIdQueryKey,
    user.id,
  ]);

  let isBlocked = false;

  if (listBlockedUser.data && listBlockedUser.data.length > 0)
    isBlocked = listBlockedUser.data.includes(user.id);

  const onBlock = () => {
    setIsShown(false);
    // Add user to the blocked list
    void axios
      .post(
        `${apiUrl}/block/add-blocked-user`,
        { targetId: user.id },
        {
          withCredentials: true,
        },
      )
      .then(async () => {
        await queryClient.invalidateQueries(listUsersBlockedQueryKey);
        socket.emit('signalBlock');
      });
    setBlocked(true);
    // If dm exists delete it
    if (directMessageId) {
      socket.emit('leaveRoom', {
        leaveInfo: {
          id: directMessageId,
          type: channelType.DirectMessage,
        },
      });
    }
  };

  const onUnblock = () => {
    setIsShown(false);
    void axios
      .post(
        `${apiUrl}/block/remove-blocked-user`,
        { targetId: user.id },
        {
          withCredentials: true,
        },
      )
      .then(async () => {
        await queryClient.invalidateQueries(listUsersBlockedQueryKey);
        socket.emit('signalBlock');
      });
    setBlocked(false);
  };

  return (
    <>
      {listBlockedUser.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {listBlockedUser.isLoading && <LoadingSpinner />}
      {isBlocked ? (
        <p
          className="text-center hover:underline my-2 truncate cursor-pointer"
          onClick={onUnblock}
        >
          Unblock {user.nickname}
        </p>
      ) : (
        <p
          className="text-center hover:underline my-2 truncate cursor-pointer"
          onClick={onBlock}
        >
          Block {user.nickname}
        </p>
      )}
    </>
  );
}

export default BlockUser;
