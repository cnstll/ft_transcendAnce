import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { socket } from 'src/components/global-components/client-socket';
import { channelType, User } from '../../global-components/interface';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function SendDM({ user, setIsShown }: BlockFriendsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const channelsQueryKey = 'channelsByUserList';

  useEffect(() => {
    socket.on('roomCreated', async (channelId: string) => {
      await queryClient.refetchQueries(channelsQueryKey);
      navigate('../chat/' + channelId);
    });
    return () => {
      socket.off('roomCreated');
      socket.off('createRoomFailed');
    };
  }, []);

  const onSendDM = () => {
    setIsShown(false);
    socket.emit('createRoom', {
      createInfo: { name: user.nickname, type: channelType.DirectMessage },
    });
    return () => {
      socket.off('roomCreated');
    };
  };

  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onSendDM}
    >
      Send DM {user.nickname}
    </p>
  );
}

export default SendDM;
