import { Link } from 'react-router-dom';
import { Channel, channelType } from '../../global-components/interface';
import JoinChannel from '../../custom-hooks/emit-join-channel';
import PasswordModal from './password-modal';
import { useState } from 'react';

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
        <li className="p-4">{channel.name}</li>
      </Link>
      {showModal &&
        <PasswordModal setShowModal={setShowModal} channel={channel}
      />}
    </>
  );
}

export default SearchChannelItem;
