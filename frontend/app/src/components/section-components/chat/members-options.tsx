import { Link } from 'react-router-dom';
import {
  channelRole,
  channelType,
  User,
  UserConnectionStatus,
} from '../../global-components/interface';
import BlockUser from './block-user';
import InviteToPlay from '../game/invite-to-play';
import PromoteToAdmin from './promote-to-admin';
import WatchGame from '../game/watch-game-options';
import SendDM from './send-dm';
import { useQueryClient } from 'react-query';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  type: channelType | undefined;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  isBlocked: boolean | undefined;
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
  role: channelRole;
}

function MembersOptions({
  user,
  channelId,
  role,
  setIsShown,
  type,
  setActiveChannelId,
  isBlocked,
  setIsBlocked,
}: UserOptionsProps) {
  const queryClient = useQueryClient();
  const myRoleQueryKey = 'myRoleInChannel';
  const myRoleQueryData: { role: channelRole } | undefined =
    queryClient.getQueryData([myRoleQueryKey, channelId]);

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
      <BlockUser
        user={user}
        setIsShown={setIsShown}
        setIsBlocked={setIsBlocked}
      />
      {myRoleQueryData &&
        (myRoleQueryData.role === channelRole.Owner ||
          myRoleQueryData.role === channelRole.Admin) && (
          <PromoteToAdmin
            user={user}
            setIsShown={setIsShown}
            channelId={channelId}
            role={role}
          />
        )}
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}

export default MembersOptions;
