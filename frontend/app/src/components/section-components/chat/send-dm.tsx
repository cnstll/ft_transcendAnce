import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { socket } from 'src/components/global-components/client-socket';
import { channelType, User } from '../../global-components/interface';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
}

function SendDM({ user, setIsShown, setActiveChannelId }: BlockFriendsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('roomCreated', async (channelId: string) => {
      setIsShown(false);
      await queryClient.refetchQueries('channelsByUserList');
      if (setActiveChannelId) setActiveChannelId(channelId);
      navigate('../chat/' + channelId);
    });
    socket.on('createRoomFailed', (channel: null | string) => {
      if (channel === null || typeof channel === 'string') {
        toast.error("You can't speak to one another, someone is blocked", {
          toastId: 'toast-error-block-message',
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    return () => {
      socket.off('roomCreated');
      socket.off('createRoomFailed');
    };
  });

  const onSendDM = () => {
    //Create a DM between the 2 users
    socket.emit('createRoom', {
      createInfo: {
        name: user.nickname,
        type: channelType.DirectMessage,
        userId: user.id,
      },
    });
  };

  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onSendDM}
    >
      Send DM
    </p>
  );
}

export default SendDM;
