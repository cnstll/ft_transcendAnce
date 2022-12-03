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
  const activeChannelCtx = useContext(channelContext);

  function onBan() {
    socket.emit('banUser', {
      banInfo: {
        channelActionTargetId: props.user?.id,
        channelActionOnChannelId: activeChannelCtx.id,
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
