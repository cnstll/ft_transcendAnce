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

function SearchChannelItem({ channel, invited }: { channel: Channel, invited: boolean }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (channel.type === channelType.Private && invited === false)
    /** replace with a toatify notification */
      alert("You're not invited to this channel");
    else if (channel.type === channelType.Protected) {
      setShowModal(true);
    }
    else {
      JoinChannel(channel);
    }
  }

  console.log("invited is ", invited);

  return (
    <>
      <Link to={`../chat/${channel.id}`} onClick={onClick}>
        <div className='flex justify-start p-2'>
          <li className="px-2 flex-wrap break-words">
            {channel.type === channelType.Protected && (
              <FontAwesomeIcon className="text-md text-purple-medium pr-1" icon={faLock} />
            )}
            {invited === true && channel.type === channelType.Private && (
              <FontAwesomeIcon className="text-md text-purple-medium pr-1" icon={faEnvelopeCircleCheck} />
            )}
            {invited === false && channel.type === channelType.Private && (
              <FontAwesomeIcon className="text-md text-red-500 pr-1" icon={faEnvelope}/>
            )}
            {channel.name} </li>
        </div>
      </Link>
      {showModal &&
        <PasswordModal setShowModal={setShowModal} channel={channel}
      />}
    </>
  );
}

export default SearchChannelItem;
