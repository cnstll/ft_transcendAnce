import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCommentDots} from '@fortawesome/free-solid-svg-icons';
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

  function channelElementsRender(style?: string) {
    return (
      <div className={style + " flex items-center justify-start"}>
        <div className="flex items-center justify-start mx-2">
          {(channelItem.type === "PUBLIC" || channelItem.type === "PRIVATE" || channelItem.type === "PROTECTED")
            && <FontAwesomeIcon className="text-2xl" icon={faUsers} />}
          {channelItem.type === "DIRECTMESSAGE"  && <FontAwesomeIcon className="text-2xl" icon={faCommentDots} />}
        </div>
        <div className="w-40 flex-wrap break-words py-4 px-2">
          <p className="ml-3">{channelItem.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div onClick={activeStateHandler}>
      {isActive && channelElementsRender("bg-purple-light")}
      {!isActive && channelElementsRender("")}
    </div>
  )
}

export default ChannelsListItem;
