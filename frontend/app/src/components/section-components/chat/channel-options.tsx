import { useContext, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Channel,
  channelActionType,
  channelRole,
  channelType,
} from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import EditChannelForm from './edit-channel-form';
import InviteModal from './invite-modal';
import { toast } from 'react-toastify';
import { channelContext } from '../../global-components/chat';

/* review datafetching of role in channel to not refetch multiple times */

interface ChannelOptions {
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChannelOptions({ setIsShown }: ChannelOptions) {
  const currentChannelCtx = useContext(channelContext);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  /* Interface with react query cache data to synchronize on events */
  const queryClient = useQueryClient();
  const isCurrentUserUnderModerationQueryKey = 'isCurrentUserUnderModeration';
  const myRoleQueryKey = 'myRoleInChannel';

  /* Getting cached data from react query */
  const myRoleQueryData: { role: channelRole } | undefined =
    queryClient.getQueryData([myRoleQueryKey, currentChannelCtx.id]);
  const userIsBanned: boolean | undefined = queryClient.getQueryData([
    isCurrentUserUnderModerationQueryKey,
    currentChannelCtx.id,
    channelActionType.Ban,
  ]);

  function leaveChannel(channelInfo: Channel) {
    socket.emit('leaveRoom', {
      leaveInfo: { id: channelInfo.id, type: channelInfo.type },
    });
    setIsShown(false);
  }

  function leaveChannelHandler() {
    if (currentChannelCtx.id !== '') {
      leaveChannel(currentChannelCtx);
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
        currentChannelCtx.type !== channelType.DirectMessage ? (
          <div className="z-40">
            <div onClick={handleEditModal}>
              <p className="text-center hover:underline my-2">Edit channel</p>
            </div>
            <div>
              {showEditModal && (
                <EditChannelForm
                  setShowModal={setShowEditModal}
                  currentChannel={currentChannelCtx}
                  setIsShown={setIsShown}
                />
              )}
            </div>
          </div>
        ) : null}
        {(myRoleQueryData?.role === channelRole.Owner ||
          myRoleQueryData?.role === channelRole.Admin) &&
        currentChannelCtx.type === channelType.Private &&
        !userIsBanned?.valueOf() ? (
          <div className="z-40">
            <div onClick={handleInviteModal}>
              <p className="text-center hover:underline my-2">Invite members</p>
            </div>
            <div>
              {showInviteModal && (
                <InviteModal
                  setShowModal={setShowInviteModal}
                  channel={currentChannelCtx}
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
export default ChannelOptions;
