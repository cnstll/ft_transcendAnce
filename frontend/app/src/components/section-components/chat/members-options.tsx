import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { channelContext } from '../../global-components/chat';
import {
  Channel,
  channelRole,
  channelType,
  User,
  UserConnectionStatus,
} from '../../global-components/interface';
import BlockFriends from './block-friends';
import InviteToPlay from '../game/invite-to-play';
import PromoteToAdmin from './promote-to-admin';
import WatchGame from '../game/watch-game-options';
import SendDM from './send-dm';
import BanUser from './ban-user';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  type: channelType | undefined;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  channelId: string;
  role: channelRole;
}

function MembersOptions({
  user,
  setIsShown,
  channelId,
  role,
  type,
  setActiveChannelId,
}: UserOptionsProps) {
  //   const myRole = useMyChannelRole(channelId);
  const queryClient = useQueryClient();
  const channelCtx = useContext(channelContext);
  const myRoleQueryKey = 'myRoleInChannel';
  const channelsOfUserKey = 'channelsByUserList';
  const myRoleQueryData: { role: string } | undefined =
    queryClient.getQueryData([myRoleQueryKey, channelCtx.activeChannelId]);
  const channelsOfUserQueryData: Channel[] | undefined =
    queryClient.getQueryData([channelsOfUserKey]);

  /*Begin of Helper functions for conditionnal display */
  function hasBanRight() {
    return (
      myRoleQueryData &&
      (myRoleQueryData.role === channelRole.Owner ||
        myRoleQueryData.role === channelRole.Admin)
    );
  }
  function isGroupChannel() {
    const activeChannelType: channelType | undefined =
      channelsOfUserQueryData?.find(
        (channel) => channel.id === channelCtx.activeChannelId,
      )?.type;
    return activeChannelType && activeChannelType !== channelType.DirectMessage;
  }
  /* End of Helper functions for conditionnal display */

  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {user.status === UserConnectionStatus.ONLINE && (
        <InviteToPlay user={user} setIsShown={setIsShown} />
      )}
      {type !== channelType.DirectMessage && (
        <SendDM
          user={user}
          setIsShown={setIsShown}
          setActiveChannelId={setActiveChannelId}
        />
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
      {hasBanRight() && isGroupChannel() && (
        <BanUser user={user} setIsShown={setIsShown} />
      )}
    </div>
  );
}

export default MembersOptions;
