import { Link } from 'react-router-dom';
import { Channel, channelType } from '../../global-components/interface';
import JoinChannel from '../../custom-hooks/emit-join-channel';
import PasswordModal from './password-modal';
import { useState } from 'react';
import {
  faLock,
  faEnvelope,
  faEnvelopeCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';

function SearchChannelItem({ channel, invited }: { channel: Channel, invited: boolean }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const customToastId = "custom-toast-chan-not-invited";

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (channel.type === channelType.Private && !invited)
      toast.error("You're not invited to this channel", {
        toastId: customToastId,
        position: toast.POSITION.TOP_LEFT
      });
    else if (channel.type === channelType.Protected) {
      setShowModal(true);
    }
    else {
      JoinChannel(channel);
    }
  }

  return (
    <>
      <Link to={`../chat/${channel.id}`} onClick={onClick}>
        <div className='flex justify-start p-3'>
          <li className="px-2 flex-wrap break-words">
            {channel.type === channelType.Protected && (
              <FontAwesomeIcon className="text-md text-purple-medium pr-1" icon={faLock} />
            )}
            {invited && channel.type === channelType.Private && (
              <FontAwesomeIcon className="text-md text-purple-medium pr-1" icon={faEnvelopeCircleCheck} />
            )}
            {!invited && channel.type === channelType.Private && (
              <FontAwesomeIcon className="text-md text-gray-400 pr-1" icon={faEnvelope}/>
            )}
            {channel.name} </li>
        </div>
        <ToastContainer closeButton={false}/>
      </Link>
      {showModal &&
        <PasswordModal setShowModal={setShowModal} channel={channel}
      />}
    </>
  );
}

export default SearchChannelItem;
