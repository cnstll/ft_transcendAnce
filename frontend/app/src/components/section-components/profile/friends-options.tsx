import { Link } from 'react-router-dom';
import { User, UserConnectionStatus } from '../../global-components/interface';
import BlockFriends from '../chat/block-friends';
import SendDM from '../chat/send-dm';
import InviteToPlay from '../play/invite-to-play';
import WatchGame from '../play/watch-game';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function FriendsOptions({ user, setIsShown }: UserOptionsProps) {
  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      <SendDM user={user} setIsShown={setIsShown} />
      <BlockFriends user={user} setIsShown={setIsShown} />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}
export default FriendsOptions;
