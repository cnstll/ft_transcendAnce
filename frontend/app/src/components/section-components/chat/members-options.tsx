import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { channelContext } from '../../global-components/chat';
import {
  Channel,
  channelActionType,
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
import BanUser from './ban-user';

interface UserOptionsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  blocked: boolean | undefined;
  setBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  isBlocked: boolean | undefined;
  role: channelRole;
}

function MembersOptions({
  user,
  role,
  setIsShown,
  setActiveChannelId,
  blocked,
  setBlocked,
  isBlocked,
}: UserOptionsProps) {
  //   const myRole = useMyChannelRole(channelId);
  const queryClient = useQueryClient();
  const activeChannelCtx = useContext(channelContext);
  const myRoleQueryKey = 'myRoleInChannel';
  const channelsOfUserKey = 'channelsByUserList';
  const isUserUnderModeration = 'isUserUnderModeration';
  const myRoleQueryData: { role: string } | undefined =
    queryClient.getQueryData([myRoleQueryKey, activeChannelCtx.id]);
  const channelsOfUserQueryData: Channel[] | undefined =
    queryClient.getQueryData([channelsOfUserKey]);
  const isUserBanned: boolean | undefined = queryClient.getQueryData([
    isUserUnderModeration,
    activeChannelCtx.id,
    user.id,
    channelActionType.Ban,
  ]);

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
        (channel) => channel.id === activeChannelCtx.id,
      )?.type;
    return activeChannelType && activeChannelType !== channelType.DirectMessage;
  }
  /* End of Helper functions for conditionnal display */

  return (
    <div>
      <Link to={`/profile/${user.nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      {!isUserBanned?.valueOf() && (
        <>
          {user.status === UserConnectionStatus.ONLINE && (
            <InviteToPlay user={user} setIsShown={setIsShown} />
          )}
          {activeChannelCtx.type !== channelType.DirectMessage &&
            !blocked &&
            !isBlocked && (
              <SendDM
                user={user}
                setIsShown={setIsShown}
                setActiveChannelId={setActiveChannelId}
              />
            )}
          <BlockUser
            user={user}
            setIsShown={setIsShown}
            setBlocked={setBlocked}
          />
          {myRoleQueryData &&
            (myRoleQueryData.role === channelRole.Owner ||
              myRoleQueryData.role === channelRole.Admin) && (
              <PromoteToAdmin
                user={user}
                setIsShown={setIsShown}
                channelId={activeChannelCtx.id}
                role={role}
              />
            )}
          {user.status === UserConnectionStatus.PLAYING && (
            <WatchGame user={user} setIsShown={setIsShown} />
          )}
          {hasBanRight() && isGroupChannel() && (
            <BanUser user={user} setIsShown={setIsShown} />
          )}
        </>
      )}
    </div>
  );
}

export default MembersOptions;
