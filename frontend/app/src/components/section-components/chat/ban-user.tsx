import { Dispatch, useContext } from 'react';
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
