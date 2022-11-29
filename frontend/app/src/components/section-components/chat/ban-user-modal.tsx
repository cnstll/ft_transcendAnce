import { Dispatch, useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { socket } from 'src/components/global-components/client-socket';
import {
  channelActionType,
  User,
} from 'src/components/global-components/interface';
import { channelContext } from '../../global-components/chat';
// import { useGetUsersUnderModerationAction } from '../../query-hooks/getModerationActionInfo';
// import { useGetUsersUnderModerationAction } from '../../query-hooks/getModerationActionInfo';
// import { useChannelUsers } from '../../query-hooks/useGetChannelUsers';

interface BanUserProps {
  user: User | undefined;
  setIsShown: Dispatch<React.SetStateAction<boolean>>;
}

function BanUser(props: BanUserProps) {
  const queryClient = useQueryClient();
  queryClient;
  const timer = new Date('August 19, 1975 00:00:05 GMT+01:00');
  const channelCtx = useContext(channelContext);
  //   const bannedUsers = useGetUsersUnderModerationAction(
  //     channelContext.activeChannelId,
  //     channelActionType.Ban,
  //   );
  //   const channelUsers = useChannelUsers(channelContext.activeChannelId);

  useEffect(() => {
    socket.on('banFailed', (banInfo: string) => {
      alert(`Oups : ${banInfo}`);
    });
    return () => {
      socket.off('banFailed');
    };
  }, []);

  function onBan() {
    socket.emit('banUser', {
      banInfo: {
        channelActionTargetId: props.user?.id,
        channelActionOnChannelId: channelCtx.activeChannelId,
        channelActionDuration: timer,
        type: channelActionType.Ban,
      },
    });
    props.setIsShown(false);
  }
  //List of banned users
  //List of users in the channel crossed with list of banned users
  //Emit banUser > update db
  //Listen to ban events
  //If user not admin or owner, cannot ban
  //If user already banned, cannot ban
  //If channel is a DM, cannot ban

  return (
    <>
      <p
        className="text-center hover:underline my-2 truncate cursor-pointer"
        onClick={onBan}
      >
        Ban
      </p>
    </>
  );
}

export default BanUser;
