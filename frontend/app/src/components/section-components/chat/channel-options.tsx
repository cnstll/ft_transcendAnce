import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Channel, User, channelRole } from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import EditChannelForm from './edit-channel-form';
import { useMyChannelByUserId } from 'src/components/query-hooks/useGetChannels';
import InviteModal from './invite-modal';

/* review datafetching of role in channel to not refetch multiple times */

interface ChannelOptions {
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChannelOptions({ setActiveChannelId, setIsShown }: ChannelOptions) {
  const { activeChannel } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const channelsQueryKey = 'channelsByUserList';
  const userQueryKey = 'userData';
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  const channelsQueryData: Channel[] | undefined =
    queryClient.getQueryData(channelsQueryKey);

  const channelInfo = channelsQueryData?.find(
    (channel) => channel.id == activeChannel,
  );
  const userQueryData: User | undefined =
    queryClient.getQueryData(userQueryKey);

  const myRole = useMyChannelByUserId(channelInfo?.id ?? '');
  console.log("option log: ", myRole.data);

  useEffect(() => {
    socket.on(
      'roomLeft',
      async (leavingInfo: { userId: string; channelId: string }) => {
        // User receiving the event is the user leaving the room
        if (userQueryData?.id === leavingInfo.userId) {
          const channelListDisplayed: Channel[] | undefined =
            await queryClient.getQueryData(channelsQueryKey);
          if (channelListDisplayed && channelListDisplayed.length > 1) {
            const deletedChannel = leavingInfo.channelId;
            // Find another existing channel to redirect the user to after leaving current one
            const nextChannelId =
              channelListDisplayed.find(
                (channel) => channel.id != deletedChannel,
              )?.id ?? '';
            setActiveChannelId(nextChannelId);
            setIsShown(false);
            navigate(`../chat/${nextChannelId}`);
          }
        } else {
          //TODO User still in the room should get notified that a user left
        }
        await queryClient.invalidateQueries(channelsQueryKey);
      },
    );
    socket.on('leaveRoomFailed', () => alert('Failed to leave room'));
    return () => {
      socket.off('roomLeft');
      socket.off('leaveRoomFailed');
    };
  }, [myRole]);

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

  function handleEditModal() {
    setShowEditModal(!showEditModal);
  }

  function handleInviteModal() {
    setShowInviteModal(!showInviteModal);
  }

  if (channelInfo !== undefined)
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
        {myRole.data?.role === channelRole.Owner ?
        (<div className="z-index-20">
            <div onClick={handleEditModal}>
              <p className="text-center hover:underline my-2">Edit channel</p>
            </div>
            <div>
              {showEditModal && (
                <EditChannelForm
                  setShowModal={setShowEditModal}
                  currentChannel={channelInfo}
                  setIsShown={setIsShown}
                />
              )}
            </div>
          </div>
        ) : null}
        {(myRole.data?.role === channelRole.Owner ||
          myRole.data?.role === channelRole.Admin) ?
          (<div className="z-index-20">
            <div onClick={handleInviteModal}>
              <p className="text-center hover:underline my-2">Invite members</p>
            </div>
            <div>
              {showInviteModal && (
                <InviteModal
                  setShowModal={setShowInviteModal}
                  channel={channelInfo}
                />
              )}
            </div>
          </div>
        ) : null}
        <Link to="/">
          <p className="text-center hover:underline my-2">Ban user</p>
        </Link>
      </div>
    );
  else return <></>;
}
export default ChannelOptions;
