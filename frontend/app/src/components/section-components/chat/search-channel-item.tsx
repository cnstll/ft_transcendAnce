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

function SearchChannelItem({ channel }: { channel: Channel }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (channel.type == channelType.Protected) {
      setShowModal(true);
    }
    else {
      JoinChannel(channel);
    }
  }

  return (
    <>
      <Link to={`../chat/${channel.id}`} onClick={onClick}>
        <div className='flex justify-start p-2'>
          <div>
          {channel.type === channelType.Protected && (
            <FontAwesomeIcon className="text-md text-purple-medium" icon={faLock} />
          )}
          {channel.type === channelType.Private && (
            <FontAwesomeIcon className="text-md text-purple-medium" icon={faEnvelopeCircleCheck} />
          )}
          {channel.type === channelType.Private && (
            <FontAwesomeIcon className="text-md text-red-500" icon={faEnvelope} />
          )}
          </div>
          <li className="px-2">{channel.name}</li>
        </div>
      </Link>
      {showModal &&
        <PasswordModal setShowModal={setShowModal} channel={channel}
      />}
    </>
  );
}

export default SearchChannelItem;
