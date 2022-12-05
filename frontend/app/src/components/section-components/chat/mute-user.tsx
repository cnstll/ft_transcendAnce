import { Dispatch, useContext } from 'react';
import { channelContext } from '../../global-components/chat';
import { socket } from '../../global-components/client-socket';
import { channelActionType, User } from '../../global-components/interface';

interface MuteUserProps {
  user: User | undefined;
  setIsShown: Dispatch<React.SetStateAction<boolean>>;
}
function MuteUser({ user, setIsShown }: MuteUserProps) {
  const activeChannelCtx = useContext(channelContext);
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

  return (
    <>
      <p
        className="text-center hover:underline my-2 truncate cursor-pointer"
        onClick={muteUser}
      >
        Mute
      </p>
    </>
  );
}

export default MuteUser;
