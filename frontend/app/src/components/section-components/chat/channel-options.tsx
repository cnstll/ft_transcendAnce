import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Channel, channelRole } from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import EditChannelForm from './edit-channel-form';
import { useMyChannelByUserId } from 'src/components/query-hooks/useGetChannels';

/* review datafetching of role in channel to not refetch multiple times */

interface ChannelOptions {
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}

function ChannelOptions({ setActiveChannelId }: ChannelOptions) {
  const { activeChannel } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const channelsQueryKey = 'channelsByUserList';
  const [showModal, setShowModal] = useState<boolean>(false);


  const channelsQueryData: Channel[] | undefined =
    queryClient.getQueryData(channelsQueryKey);
  const channelInfo = channelsQueryData?.find(
    (channel) => channel.id == activeChannel,
  );

  interface UserChannel {
    userId: string;
    channelId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }

  useEffect(() => {
    socket.on('roomLeft', async (leavingUser: UserChannel) => {
      await queryClient.refetchQueries(channelsQueryKey);
      const channelsUpdated: Channel[] | undefined =
        await queryClient.getQueryData(channelsQueryKey);
      if (channelsUpdated && channelsUpdated.length > 0) {
        const deletedChannel = leavingUser.channelId;
        // Find another existing channel to redirect the user to after leaving current one
        const nextChannelId =
          channelsUpdated.find((channel) => channel.id != deletedChannel)?.id ??
          '';
        setActiveChannelId(nextChannelId);
        navigate(`../chat/${nextChannelId}`);
      } else {
        navigate('../chat');
      }
    });
    socket.on('leaveRoomFailed', () => alert('Failed to leave room'));
    return () => {
      socket.off('roomLeft');
      socket.off('leaveRoomFailed');
    };
  }, []);

  function leaveChannel(channelInfo: Channel) {
    console.log("checkpoint emit leaveRoom");
    socket.emit('leaveRoom', { leaveInfo: { id: channelInfo.id } });
  }

  function leaveChannelHandler() {
    if (channelInfo != undefined) {
      leaveChannel(channelInfo);
    } else {
      alert('Failed to leave room');
    }
  }

  function handleModal() {
    setShowModal(!showModal);
  }

  const myRole = useMyChannelByUserId(channelInfo?.id ?? '');

  if (channelInfo !== undefined)
    return (
      <div>
        <Link to="/chat">
          <p className="text-center hover:underline my-2"
            onClick={leaveChannelHandler}>
            Leave channel
          </p>
        </Link>
        {myRole.data?.role === channelRole.Owner ?
          <div className="z-index-20">
            <div onClick={handleModal}>
              <p className="text-center hover:underline my-2">
                Edit channel
              </p>
            </div>
            <div>
                {showModal &&
                <EditChannelForm setShowModal={setShowModal} currentChannel={channelInfo} />}
            </div>
          </div>
        : null}
        <Link to="/">
          <p className="text-center hover:underline my-2">Invite user</p>
        </Link>
        <Link to="/">
          <p className="text-center hover:underline my-2">Ban user</p>
        </Link>
      </div>
    );
  else
    return <></>;
}
export default ChannelOptions;
