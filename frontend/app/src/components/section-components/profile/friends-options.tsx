import { User, UserConnectionStatus } from '../../global-components/interface';
import SendDM from '../chat/send-dm';
import InviteToPlay from '../game/invite-to-play';
import WatchGame from '../game/watch-game-options';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  isBlocked: boolean | undefined;
}

function FriendsOptions({ user, setIsShown, isBlocked }: UserOptionsProps) {
  return (
    <div>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      {!isBlocked && <SendDM user={user} setIsShown={setIsShown} />}
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}
export default FriendsOptions;
