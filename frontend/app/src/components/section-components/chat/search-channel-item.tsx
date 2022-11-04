import { Link, useNavigate } from 'react-router-dom';
import { Channel } from '../../global-components/interface';
import NormUrl from '../../custom-hooks/norm-url';
import JoinChannel from '../../custom-hooks/emit-join-channel';
import { socket } from '../../global-components/client-socket';

interface SearchChannelItemProps {
  channel: Channel;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchChannelItem(p: SearchChannelItemProps) {
  const navigate = useNavigate();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    JoinChannel(p.channel);
    socket.on('roomJoined', () => {
      p.setIsShown(false);
      navigate('../chat/' + p.channel.id);
    });
    socket.on('joinRoomFailed', () => alert('Failed to join room'));
  }

  return (
    <>
      <Link to={NormUrl('/chat/', p.channel.name)} onClick={onClick}>
        <li className="p-4">{p.channel.name}</li>
      </Link>
    </>
  );
}

export default SearchChannelItem;
