import axios from 'axios';
import { useState } from 'react';
import { apiUrl, User } from '../../global-components/interface';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockFriends({ user, setIsShown }: BlockFriendsProps) {
  const [isBlocked, setIsBlocked] = useState(false);

  //Check if the targeted user is blocked
  void axios
    .post<boolean>(
      `${apiUrl}/user/check-current-user-blocked-target`,
      { targetId: user.id },
      {
        withCredentials: true,
      },
    )
    .then((res) => setIsBlocked(res.data));

  const onBlock = () => {
    setIsShown(false);
  };

  const onUnblock = () => {
    setIsShown(false);
  };

  return (
    <>
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

export default BlockFriends;
