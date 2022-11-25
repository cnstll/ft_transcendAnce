import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { socket } from 'src/components/global-components/client-socket';
import { apiUrl, channelType, User } from '../../global-components/interface';

interface BlockFriendsProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function SendDM({ user, setIsShown }: BlockFriendsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const channelsQueryKey = 'channelsByUserList';
  const [isBlocked, setIsBlocked] = useState(false);
  // const [conversationExists, setConversationExists] = useState(false);

  useEffect(() => {
    socket.on('roomCreated', async (channelId: string) => {
      await queryClient.refetchQueries(channelsQueryKey);
      navigate('../chat/' + channelId);
    });
    return () => {
      socket.off('roomCreated');
      socket.off('createRoomFailed');
    };
  }, [channelsQueryKey]);

  const onSendDM = () => {
    setIsShown(false);

    //Check if one of the user is blocked
    void axios
      .post<boolean>(
        `${apiUrl}/user/check-user-is-blocked`,
        { targetId: user.id },
        {
          withCredentials: true,
        },
      )
      .then((res) => setIsBlocked(res.data));
    console.log(isBlocked);
    if (isBlocked) return;

    //Check if a DM between the 2 users already exists

    //Create a DM between the 2 users
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
      Send DM
    </p>
  );
}

export default SendDM;
