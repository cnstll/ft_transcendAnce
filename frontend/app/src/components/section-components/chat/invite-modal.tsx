import { Dispatch, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { socket } from 'src/components/global-components/client-socket';
import { Channel, User } from 'src/components/global-components/interface';
import {
  getInvitableUsers,
  useInvitesOfAChannel,
} from 'src/components/query-hooks/getChannelInvites';
import LoadingSpinner from '../loading-spinner';
import UsersListItem from '../users-list-item';

interface InviteModalProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  channel: Channel;
}

function InviteModal(props: InviteModalProps) {
  const [formData, setFormData] = useState('');
  const [inputStatus, setInputStatus] = useState<string>('empty');
  const channelInvitesQueryKey = 'invitesOfAChannel';
  const queryClient = useQueryClient();
  const invites = useInvitesOfAChannel(props.channel.id);
  const invitableUsersKey = 'invitableUsers';
  const invitableUsers = getInvitableUsers(props.channel.id);

  useEffect(() => {
    socket.on('inviteSucceeded', async () => {
      await queryClient.refetchQueries(channelInvitesQueryKey);
      await queryClient.refetchQueries(invitableUsersKey);
      setFormData('');
    });
    socket.on('inviteFailed', (inviteToChannel: null | string) => {
      if (inviteToChannel === 'alreadyInvited') {
        setInputStatus('alreadyInvited');
      }
    });
    return () => {
      socket.off('invitationSent');
      socket.off('invitationFailed');
    };
  }, [formData, invitableUsers]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStatus('editing');
    setFormData(e.target.value);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit('inviteToChannel', {
      inviteInfo: {
        channelId: props.channel.id,
        invitedId: formData,
        type: props.channel.type,
      },
    });
  }

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow text-black p-6">
            <h3
              className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b"
            >
              Invite members to {props.channel.name}
            </h3>
            <div className="my-4">
              <h4
                className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
              >
                Already invited to your channel:
              </h4>
              {invites.isSuccess ? (
                invites.data?.length ? (
                  <ul className="grid gap-y-4 grid-cols-2">
                    {' '}
                    {invites.data.map((invitedUser: User) => (
                      <UsersListItem key={invitedUser.id} user={invitedUser} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 font-normal text-center">
                    Invite someone to dance with 💃
                  </p>
                )
              ) : invites.isLoading ? (
                <LoadingSpinner />
              ) : (
                <p className="text-base text-gray-400">
                  We encountered an error 🤷
                </p>
              )}
            </div>
            <form onSubmit={onSubmit}>
              <div id="form-channel-invite" className="form-group mt-4">
                <label
                  htmlFor="ChannelInvite"
                  className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold"
                >
                  Invite new members:
                </label>
                {invitableUsers.isSuccess ? (
                  invitableUsers.data?.length ? (
                    <ul className="grid gap-y-4 grid-cols-1 m-2">
                      {' '}
                      {invitableUsers.data.map((invitedUser: User) => (
                        <div
                          className="flex items-center gap-4 my-1"
                          key={invitedUser.id}
                        >
                          <input
                            type="radio"
                            name="invite"
                            id="invitedId"
                            value={invitedUser.id}
                            onChange={onChange}
                          />
                          <UsersListItem user={invitedUser} />
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 font-normal text-center">
                      No one to invite 😞
                    </p>
                  )
                ) : invitableUsers.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <p className="text-base text-gray-400">
                    We encountered an error 🤷
                  </p>
                )}
                {inputStatus === 'alreadyInvited' && (
                  <p className="text-red-500 text-xs font-medium my-1">
                    This member is already invited!
                  </p>
                )}
              </div>
              <div className="flex items-center py-2 space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => props.setShowModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200
                  text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                >
                  Quit
                </button>
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default InviteModal;
