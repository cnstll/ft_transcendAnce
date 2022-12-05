import { useState } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Channel,
  channelRole,
  channelType,
  User,
} from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import EditChannelForm from './edit-channel-form';
import InviteModal from './invite-modal';
import LoadingSpinner from '../loading-spinner';
import ErrorMessage from '../error-message';
import { toast } from 'react-toastify';

/* review datafetching of role in channel to not refetch multiple times */

interface ChannelOptions {
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  currentChannel: UseQueryResult<Channel | undefined>;
}

function ChannelOptions({ setIsShown, currentChannel }: ChannelOptions) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  /* Interface with react query cache data to synchronize on events */
  const queryClient = useQueryClient();
  const channelUserBannedQueryKey = 'getUsersUnderModerationAction';
  const userQueryKey = 'userData';
  const myRoleQueryKey = 'myRoleInChannel';

  /* Getting cached data from react query */
  const userQueryData: User | undefined =
    queryClient.getQueryData(userQueryKey);
  const myRoleQueryData: { role: channelRole } | undefined =
    queryClient.getQueryData([myRoleQueryKey, currentChannel.data?.id]);
  const channelUserBannedQueryData: string[] | undefined =
    queryClient.getQueryData(channelUserBannedQueryKey);

  function leaveChannel(channelInfo: Channel) {
    socket.emit('leaveRoom', {
      leaveInfo: { id: channelInfo.id, type: channelInfo.type },
    });
    setIsShown(false);
  }

  function leaveChannelHandler() {
    if (currentChannel.data && currentChannel.data.id !== '') {
      leaveChannel(currentChannel.data);
    } else {
      toast.error("Couldn't leave the channel sorry 🤷", {
        toastId: 'toast-error-leave-channel',
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  function handleEditModal() {
    setShowEditModal(!showEditModal);
  }

  function handleInviteModal() {
    setShowInviteModal(!showInviteModal);
  }

  return (
    <>
      {currentChannel.isSuccess && currentChannel.data !== undefined && (
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
          currentChannel.data.type !== channelType.DirectMessage ? (
            <div className="z-40">
              <div onClick={handleEditModal}>
                <p className="text-center hover:underline my-2">Edit channel</p>
              </div>
              <div>
                {showEditModal && (
                  <EditChannelForm
                    setShowModal={setShowEditModal}
                    currentChannel={currentChannel.data}
                    setIsShown={setIsShown}
                  />
                )}
              </div>
            </div>
          ) : null}
          {(myRoleQueryData?.role === channelRole.Owner ||
            myRoleQueryData?.role === channelRole.Admin) &&
          currentChannel.data.type === channelType.Private &&
          channelUserBannedQueryData?.some(
            (bannedUserId) => bannedUserId === userQueryData?.id,
          ) ? (
            <div className="z-40">
              <div onClick={handleInviteModal}>
                <p className="text-center hover:underline my-2">
                  Invite members
                </p>
              </div>
              <div>
                {showInviteModal && (
                  <InviteModal
                    setShowModal={setShowInviteModal}
                    channel={currentChannel.data}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
      {currentChannel.isLoading && <LoadingSpinner />}
      {currentChannel.isError && <ErrorMessage />}
    </>
  );
}
export default ChannelOptions;
