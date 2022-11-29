import { Link } from 'react-router-dom';
import {
  channelType,
  User,
  UserConnectionStatus,
} from '../../global-components/interface';
import BlockFriends from './block-friends';
import InviteToPlay from '../game/invite-to-play';
import WatchGame from '../game/watch-game-options';
import SendDM from './send-dm';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  type: channelType | undefined;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  isBlocked: boolean;
}

function MembersOptions({
  user,
  setIsShown,
  type,
  setActiveChannelId,
  isBlocked,
}: UserOptionsProps) {
  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status !== UserConnectionStatus.PLAYING && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      {type !== channelType.DirectMessage && !isBlocked && (
        <SendDM
          user={user}
          setIsShown={setIsShown}
          setActiveChannelId={setActiveChannelId}
        />
      )}
      <BlockFriends user={user} setIsShown={setIsShown} />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}

export default MembersOptions;
