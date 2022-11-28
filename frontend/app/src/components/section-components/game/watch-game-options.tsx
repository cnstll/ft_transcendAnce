import { useNavigate } from 'react-router-dom';
import { User } from '../../global-components/interface';

interface WatchGameProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function WatchGame({ user, setIsShown }: WatchGameProps) {
  const navigate = useNavigate();
  const onWatch = () => {
    setIsShown(false);
    navigate(`/watch/${user.id}`);
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
