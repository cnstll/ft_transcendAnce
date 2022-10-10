import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers as faChannel, faCommentDots as faMessage} from '@fortawesome/free-solid-svg-icons';
import { Channel } from "../global-components/chat";
import { useState } from 'react';

type ChannelsListProps = {
  channelItem: Channel;
}

function ChannelsListItem({ channelItem }: ChannelsListProps) {
  const [isActive, setIsActive] = useState(false);

  function activeStateHandler() {
    setIsActive((current) => !current);
  }

  return (
    <div onClick={activeStateHandler}>
      <div className={isActive ? "bg-purple-light flex items-center justify-start" : "flex items-center justify-start"}>
        <div className="flex items-center justify-start mx-2">
          {channelItem.type === "DIRECTMESSAGE"
            && <FontAwesomeIcon className="text-2xl" icon={faMessage} />}
          {(!(channelItem.type === "DIRECTMESSAGE"))
            && <FontAwesomeIcon className="text-2xl" icon={faChannel} />}
        </div>
        <div className="w-40 flex-wrap break-words py-4 px-2">
          <p className="ml-3">{channelItem.name}</p>
        </div>
      </div>
    </div>
  )
}

export default ChannelsListItem;
