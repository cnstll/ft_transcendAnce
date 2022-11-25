import { Link } from 'react-router-dom';
import {
  channelType,
  User,
  UserConnectionStatus,
} from '../../global-components/interface';
import BlockFriends from './block-friends';
import InviteToPlay from '../play/invite-to-play';
import WatchGame from '../play/watch-game';
import SendDM from './send-dm';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  type: channelType | undefined;
}

function MembersOptions({ user, setIsShown, type }: UserOptionsProps) {
  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status !== UserConnectionStatus.PLAYING && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      {type !== channelType.DirectMessage && (
        <SendDM user={user} setIsShown={setIsShown} />
      )}
      <BlockFriends user={user} setIsShown={setIsShown} />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}

export default MembersOptions;
