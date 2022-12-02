import useBlockedUser from 'src/components/query-hooks/useBlockedUser';
import { User } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockFriends({ user, setIsShown }: BlockFriendsProps) {
  const isBlocked = useBlockedUser(user.id);

  const onBlock = () => {
    setIsShown(false);
  };

  const onUnblock = () => {
    setIsShown(false);
  };

  return (
    <>
      {isBlocked.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {isBlocked.isLoading && <LoadingSpinner />}
      {isBlocked.isSuccess && isBlocked.data && (
        <p
          className="text-center hover:underline my-2 truncate cursor-pointer"
          onClick={onUnblock}
        >
          Unblock {user.nickname}
        </p>
      )}
      {isBlocked.isSuccess && !isBlocked.data && (
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

export default BlockFriends;
