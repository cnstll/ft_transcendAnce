import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Channel } from '../global-components/interface';
import { socket } from './socket';

function ChannelOptions() {
  const { activeChannel } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const channelsQueryKey = 'channelsByUserList';

  const channelsQueryData: Channel[] | undefined =
    queryClient.getQueryData(channelsQueryKey);
  const channelInfo = channelsQueryData?.find(
    (channel) => channel.id == activeChannel,
  );

  function leaveChannel(channelInfo: Channel) {
    socket.emit('leaveRoom', { leaveInfo: { id: channelInfo.id } });
  }

  function leaveChannelHandler() {
    if (channelInfo != undefined) {
      leaveChannel(channelInfo);
    } else {
      alert('Failed to leave room');
    }
  }
  useEffect(() => {
    socket.on('roomLeft', async () => {
      await queryClient.invalidateQueries(channelsQueryKey);
      if (channelsQueryData && channelsQueryData.length > 1 && channelInfo) {
        // Find another existing channel to redirect the user to after leaving current one
        const nextChannelId =
          channelsQueryData.find((channel) => channel.id != channelInfo.id)
            ?.id ?? '';

        navigate(`../chat/ ${nextChannelId}`);
      } else {
        navigate('../chat');
      }
    });
    socket.on('leaveRoomFailed', () => alert('Failed to leave room'));
  }, []);

  return (
    <div>
      <Link to="/chat">
        <p
          className="text-center hover:underline my-2"
          onClick={leaveChannelHandler}
        >
          Leave channel
        </p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Change settings</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Invite user</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Ban user</p>
      </Link>
    </div>
  );
}
export default ChannelOptions;
