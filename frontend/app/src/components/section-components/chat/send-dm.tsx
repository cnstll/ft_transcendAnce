import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
// import JoinChannel from 'src/components/custom-hooks/emit-join-channel';
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
  const [conversationId, setConversationId] = useState('');
  const [channel, setChannel] = useState({});

  useEffect(() => {
    socket.on('roomCreated', async (channelId: string) => {
      await queryClient.refetchQueries(channelsQueryKey);
      console.log('hello');
      setChannel({});
      navigate(`../chat/${channelId}`);
    });
    // socket.on(
    //   'roomJoined',
    //   async (joiningInfo: { userId: string; channelId: string }) => {
    //     await queryClient.invalidateQueries('channelsByUserList');
    //     //User joining the channel will navigate to this channel
    //     navigate(`../chat/${joiningInfo.channelId}`);
    //   },
    // );
    // socket.on('joinRoomFailed', () => {
    //   alert('Failed to join room, sorry');
    // });
    return () => {
      socket.off('roomCreated');
      socket.off('createRoomFailed');
      socket.off('roomJoined');
      socket.off('joinRoomFailed');
    };
  }, [channel]);

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
    setChannel({ name: user.nickname, type: channelType.DirectMessage });
    console.log(channel);
    socket.emit('createRoom', {
      createInfo: { channel },
    });
    // JoinChannel({
    //   id: channel,
    //   name: user.nickname,
    //   type: channelType.DirectMessage,
    //   userId: user.id,
    // });
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
