import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers as faChannel,
  faCommentDots as faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { Channel, channelType } from '../../global-components/interface';
import { useNavigate } from 'react-router-dom';

interface ChannelsListProps {
  channelItem: Channel;
  currentlyActivated: string;
  setCurrentlyActivated: React.Dispatch<React.SetStateAction<string>>;
}

function ChannelsListItem(p: ChannelsListProps) {
  const navigate = useNavigate();

  function onClickHandler() {
    p.setCurrentlyActivated(p.channelItem.id);
    navigate('../chat/' + p.channelItem.id);
  }

  const isCurrentlyActivated = () => {
    return p.currentlyActivated === p.channelItem.id;
  };

  return (
    <div onClick={onClickHandler}>
      <div
        className={
          isCurrentlyActivated()
            ? 'bg-purple-light flex items-center justify-start'
            : 'flex items-center justify-start'
        }
      >
        <div className="flex items-center justify-start mx-2">
          {p.channelItem.type === channelType.DirectMessage && (
            <FontAwesomeIcon className="text-2xl mx-1" icon={faMessage} />
          )}
          {!(p.channelItem.type === channelType.DirectMessage) && (
            <FontAwesomeIcon className="text-2xl" icon={faChannel} />
          )}
        </div>
        <div className="w-40 flex-wrap break-words py-4 px-2">
          <p className="ml-3">{p.channelItem.name}</p>
        </div>
      </div>
    </div>
  );
}

export default ChannelsListItem;
