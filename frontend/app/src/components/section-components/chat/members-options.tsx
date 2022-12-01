import { Link } from 'react-router-dom';
// import { useMyChannelRole } from 'src/components/query-hooks/useGetChannels';
import {
  channelRole,
  User,
  UserConnectionStatus,
} from '../../global-components/interface';
import BlockFriends from '../block-friends';
import InviteToPlay from '../invite-to-play';
import PromoteToAdmin from './promote-to-admin';
import WatchGame from '../watch-game-options';
import { useQueryClient } from 'react-query';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
  role: channelRole;
}

function MembersOptions({
  user,
  setIsShown,
  channelId,
  role,
}: UserOptionsProps) {
  //   const myRole = useMyChannelRole(channelId);
  const queryClient = useQueryClient();
  const myRoleQueryKey = 'myRoleInChannel';
  const myRoleQueryData: { role: channelRole } | undefined =
    queryClient.getQueryData([myRoleQueryKey, channelId]);

  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
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
      <BlockFriends user={user} setIsShown={setIsShown} />
      {user.status === UserConnectionStatus.PLAYING && (
        <WatchGame user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}

export default MembersOptions;
