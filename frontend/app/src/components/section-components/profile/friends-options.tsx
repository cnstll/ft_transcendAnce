import { User, UserConnectionStatus } from '../../global-components/interface';
import BlockFriends from '../block-friends';
import InviteToPlay from '../invite-to-play';
import WatchGame from '../watch-game-options';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function FriendsOptions({ user, setIsShown }: UserOptionsProps) {
  return (
    <div>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      <BlockFriends user={user} setIsShown={setIsShown} />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}
export default FriendsOptions;
