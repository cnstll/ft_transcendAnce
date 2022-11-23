import { User } from '../global-components/interface';

interface WatchGameProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function WatchGame({ user, setIsShown }: WatchGameProps) {
  const onWatch = () => {
    setIsShown(false);
    user; //Just to avoid warnings ATM
  };

  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onWatch}
    >
      Watch game
    </p>
  );
}
export default WatchGame;
