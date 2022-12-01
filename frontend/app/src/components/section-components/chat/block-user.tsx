import axios from 'axios';
import { useGetBlockedUsers } from 'src/components/query-hooks/useBlockedUser';
import { apiUrl, User } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

interface BlockUserProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockUser({ user, setIsShown }: BlockUserProps) {
  const listBlockedUser = useGetBlockedUsers();

  console.log(listBlockedUser.data);
  let isBlocked = false;

  if (listBlockedUser.data && listBlockedUser.data.length > 0)
    isBlocked = listBlockedUser.data.includes(user.id);

  const onBlock = () => {
    setIsShown(false);
    // Add user to the blocked list
    void axios.post(
      `${apiUrl}/block/add-blocked-user`,
      { targetId: user.id },
      {
        withCredentials: true,
      },
    );
    // To do : if dm exists delete it
  };

  const onUnblock = () => {
    setIsShown(false);
    void axios.post(
      `${apiUrl}/block/remove-blocked-user`,
      { targetId: user.id },
      {
        withCredentials: true,
      },
    );
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
