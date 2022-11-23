import { User } from '../global-components/interface';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockFriends({ user, setIsShown }: BlockFriendsProps) {
  const onBlock = () => {
    setIsShown(false);
  };

  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onBlock}
    >
      Block {user.nickname}
    </p>
  );
}

export default BlockFriends;
