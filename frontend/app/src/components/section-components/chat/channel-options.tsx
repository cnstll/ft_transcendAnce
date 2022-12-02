import { useEffect, useState } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import {
  Channel,
  channelRole,
  channelType,
  User,
} from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import EditChannelForm from './edit-channel-form';
import InviteModal from './invite-modal';

/* review datafetching of role in channel to not refetch multiple times */

interface ChannelOptions {
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  channels: UseQueryResult<Channel[] | undefined>;
}

function ChannelOptions({
  //   setActiveChannelId,
  setIsShown,
  channels,
}: ChannelOptions) {
  const { activeChannel } = useParams();
  const queryClient = useQueryClient();

  //   const channelsQueryKey = 'channelsByUserList';
  const channelUserBannedQueryKey = 'getUsersUnderModerationAction';
  const userQueryKey = 'userData';
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  const channelInfo = channels.data?.find(
    (channel) => channel.id == activeChannel,
  );

  const userQueryData: User | undefined =
    queryClient.getQueryData(userQueryKey);
  const myRoleQueryKey = 'myRoleInChannel';
  const myRoleQueryData: { role: channelRole } | undefined =
    queryClient.getQueryData([myRoleQueryKey, channelInfo?.id]);

  const channelUserBannedQueryData: string[] | undefined =
    queryClient.getQueryData(channelUserBannedQueryKey);
  useEffect(() => {
    socket.on('roomLeft', () => {
      // User receiving the event is the user leaving the room
      setIsShown(false);
    });
    socket.on('leaveRoomFailed', () => alert('Failed to leave room'));
    return () => {
      socket.off('leaveRoomFailed');
    };
  }, [queryClient]);

  function leaveChannel(channelInfo: Channel) {
    socket.emit('leaveRoom', {
      leaveInfo: { id: channelInfo.id, type: channelInfo.type },
    });
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
        {myRoleQueryData?.role === channelRole.Owner &&
        channelInfo.type !== channelType.DirectMessage ? (
          <div className="z-40">
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
        {(myRoleQueryData?.role === channelRole.Owner ||
          myRoleQueryData?.role === channelRole.Admin) &&
        channelInfo.type === channelType.Private &&
        channelUserBannedQueryData?.some(
          (bannedUserId) => bannedUserId === userQueryData?.id,
        ) ? (
          <div className="z-40">
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
      </div>
    );
  else return <></>;
}
export default ChannelOptions;
