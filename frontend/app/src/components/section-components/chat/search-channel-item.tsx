import { Link } from 'react-router-dom';
import { Channel } from '../../global-components/interface';
import JoinChannel from '../../custom-hooks/emit-join-channel';

function SearchChannelItem({ channel }: { channel: Channel }) {
  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    JoinChannel(channel);
  }

  return (
    <>
      <Link to={`../chat/${channel.id}`} onClick={onClick}>
        <li className="p-4">{channel.name}</li>
      </Link>
    </>
  );
}

export default SearchChannelItem;
