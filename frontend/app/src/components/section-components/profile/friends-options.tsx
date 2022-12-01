import { Link } from 'react-router-dom';
import { User, UserConnectionStatus } from '../../global-components/interface';
import BlockUser from '../chat/block-user';
import SendDM from '../chat/send-dm';
import InviteToPlay from '../game/invite-to-play';
import WatchGame from '../game/watch-game-options';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  isBlocked: boolean | undefined;
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

function FriendsOptions({
  user,
  setIsShown,
  isBlocked,
  setIsBlocked,
}: UserOptionsProps) {
  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      {!isBlocked && <SendDM user={user} setIsShown={setIsShown} />}
      <BlockUser
        user={user}
        setIsShown={setIsShown}
        setIsBlocked={setIsBlocked}
      />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}
export default FriendsOptions;
