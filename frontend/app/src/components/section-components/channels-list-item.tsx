import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCommentDots} from '@fortawesome/free-solid-svg-icons';
import { Channel } from "../global-components/chat";

type ChannelsListProps = {
  channelItem: Channel;
}

function ChannelsListItem({ channelItem }: ChannelsListProps) {
  return (
    <div className="flex items-center justify-start mx-2">
      <div className="flex items-center justify-start mr-2">
        {(channelItem.type === "PUBLIC" || channelItem.type === "PRIVATE" || channelItem.type === "PROTECTED")
          && <FontAwesomeIcon className="text-2xl" icon={faUsers} />}
        {channelItem.type === "DIRECTMESSAGE"  && <FontAwesomeIcon className="text-2xl" icon={faCommentDots} />}
      </div>
      <div className="w-40 flex-wrap">
        <p className="ml-3">{channelItem.name}</p>
      </div>
    </div>
  )
}

export default ChannelsListItem;
