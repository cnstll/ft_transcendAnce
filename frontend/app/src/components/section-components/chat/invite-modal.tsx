import { Dispatch, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { socket } from "src/components/global-components/client-socket";
import { Channel, User } from "src/components/global-components/interface";
import { useInvitesOfAChannel } from "src/components/query-hooks/getChannelInvites";
import UsersListItem from "../users-list-item";

interface InviteModalProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  channel: Channel;
}

/** A gerer :
 * 1 - ne pas s'inviter soi-meme,
 * 2 - ne pas re-inviter quelqu'un deja invité,
 * 3 - ne pas inviter un membre du channel (deja invité sauf owner?)
 * 4 - enlever une invitation ? */

function InviteModal(props: InviteModalProps) {
  const [formData, setFormData] = useState('');
  const [inputStatus, setInputStatus] = useState<string>('empty');
  const channelInvitesQueryKey = 'invitesOfAChannel';
  const queryClient = useQueryClient();
  const invites = useInvitesOfAChannel(props.channel.id);

  useEffect(() => {
    socket.on('inviteSucceeded', async (channel) => {
      console.log("success ", channel);
      await queryClient.refetchQueries(channelInvitesQueryKey);
      setFormData('');
    })
    socket.on('inviteFailed', (inviteToChannel: null | string) => {
      if (inviteToChannel === 'alreadyInvited') {
        setInputStatus('alreadyInvited');
      }
    });
    return () => {
      socket.off('invitationSent');
      socket.off('invitationFailed');
    };
  }, [formData]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStatus('editing');
    setFormData(e.target.value);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("data : ", props.channel.id, formData, props.channel.type);
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
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0
          h-modal h-full bg-[#222] bg-opacity-50">
          <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
            <div className="relative bg-white rounded-lg shadow text-black p-6">
              <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900
                p-4 border-b">
                Invite members to {props.channel.name}
              </h3>
        {/* Invited members - to do */}
        <div className="my-4">
        <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold">
               Already invited to your channel:
          </h4>
          {invites.data?.length ?
            <ul className="grid gap-y-4 grid-cols-2"> {invites.data.map((invitedUser: User) => (
                      <UsersListItem
                        key={invitedUser.id}
                        user={invitedUser}
                      />
                  )
              )}
            </ul>
            : <p className="text-gray-400 font-normal text-center">Invite someone to dance with 💃</p>
            }
        </div>
        {/* Search for a user section */}
              <form onSubmit={onSubmit}>
                <div id="form-channel-invite" className="form-group mt-4">
                  <label
                    htmlFor="ChannelInvite"
                    className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs
                      text-purple-light my-3 font-bold">
                    Search for a user to invite:
                  </label>
                  <input
                    className={`form-control block w-full my-3 px-3 py-1.5 text-xs bg-gray-50 bg-clip-padding
                      border-b-2 focus:ring-blue-500 focus:border-blue-500 focus:text-gray-500 ${
                      inputStatus === 'alreadyInvited' ?
                      'border-red-500' : ''
                    }`}
                    type="text"
                    name="invite"
                    id="invitedId"
                    value={formData}
                    onChange={onChange}
                    autoComplete="off"
                    placeholder="Enter the name of the user to invite"
                  />
                  {inputStatus === 'alreadyInvited' &&
                    <p className="text-red-500 text-xs font-medium my-1">
                      This member is already invited!
                      </p>}
                </div>
        {/* Buttons section */}
              <div className="flex items-center py-2 space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => props.setShowModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200
                  text-sm font-medium px-5 py-2.5 hover:text-gray-900">
                  Quit
                </button>
                <button
                  type="submit"
                  className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center">
                  Enter
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
