import { User, UserConnectionStatus } from '../../global-components/interface';
import BlockUser from '../chat/block-user';
import SendDM from '../chat/send-dm';
import InviteToPlay from '../game/invite-to-play';
import WatchGame from '../game/watch-game-options';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  isBlocked: boolean | undefined;
  blocked: boolean | undefined;
  setBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

function FriendsOptions({
  user,
  setIsShown,
  isBlocked,
  blocked,
  setBlocked,
}: UserOptionsProps) {
  return (
    <div>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      <BlockUser user={user} setIsShown={setIsShown} setBlocked={setBlocked} />
      {!isBlocked && !blocked && <SendDM user={user} setIsShown={setIsShown} />}
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}
export default FriendsOptions;
