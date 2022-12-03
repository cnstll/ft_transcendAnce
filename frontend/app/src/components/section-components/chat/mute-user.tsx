import { Dispatch, useContext } from 'react';
import { useQueryClient } from 'react-query';
import { channelContext } from '../../global-components/chat';
import { socket } from '../../global-components/client-socket';
import { channelActionType, User } from '../../global-components/interface';

interface MuteUserProps {
  user: User | undefined;
  setIsShown: Dispatch<React.SetStateAction<boolean>>;
}
function MuteUser({ user, setIsShown }: MuteUserProps) {
  const activeChannelCtx = useContext(channelContext);
  const queryClient = useQueryClient();
  const currentUserIsMutedQueryKey = 'isCurrentUserUnderModeration';
  const isMutedQuery: boolean | undefined = queryClient.getQueryData([
    currentUserIsMutedQueryKey,
    activeChannelCtx.id,
    channelActionType.Mute,
  ]);
  function muteUser() {
    socket.emit('muteUser', {
      muteInfo: {
        channelActionTargetId: user?.id,
        channelActionOnChannelId: activeChannelCtx.id,
        type: channelActionType.Mute,
      },
    });
    setIsShown(false);
  }
  function unMuteUser() {
    socket.emit('unMuteUser', {
      muteInfo: {
        channelActionTargetId: user?.id,
        channelActionOnChannelId: activeChannelCtx.id,
        type: channelActionType.Mute,
      },
    });
    setIsShown(false);
  }

  return (
    <>
      {isMutedQuery?.valueOf() ? (
        <p
          className="text-center hover:underline my-2 truncate cursor-pointer"
          onClick={unMuteUser}
        >
          Unute
        </p>
      ) : (
        <p
          className="text-center hover:underline my-2 truncate cursor-pointer"
          onClick={muteUser}
        >
          Mute
        </p>
      )}
    </>
  );
}

export default MuteUser;
