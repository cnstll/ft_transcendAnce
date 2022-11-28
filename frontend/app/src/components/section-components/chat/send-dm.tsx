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
  const [isBlocked, setIsBlocked] = useState(false);
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    socket.on('roomCreated', async (channelId: string) => {
      setIsShown(false);
      await queryClient.refetchQueries('channelsByUserList');
      navigate('../chat/' + channelId);
    });
    socket.on('createRoomFailed', (channel: null | string) => {
      if (channel === null || typeof channel === 'string') {
        alert('channel already exists');
      }
    });
    return () => {
      socket.off('roomCreated');
      socket.off('createRoomFailed');
    };
  });

  const onSendDM = () => {
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
    if (isBlocked) return;

    //Check if a DM between the 2 users already exists
    void axios
      .post<string>(
        `${apiUrl}/channels/get-direct-message-by-user-id`,
        { participantId: user.id },
        {
          withCredentials: true,
        },
      )
      .then((res) => setConversationId(res.data));
    if (conversationId) navigate('../chat/' + conversationId);

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
