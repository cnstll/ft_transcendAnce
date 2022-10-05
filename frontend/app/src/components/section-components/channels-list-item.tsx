import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCommentDots} from '@fortawesome/free-solid-svg-icons';

function ChannelsListItem(props) {
  return (
    <div className="flex items-center justify-start my-5 mx-2">
      <div className="flex items-center justify-start mr-2">
        {(props.type === "PUBLIC" || props.type === "PRIVATE" || props.type === "PROTECTED")
          && <FontAwesomeIcon className="text-2xl" icon={faUsers} />}
        {props.type === "DIRECTMESSAGE"  && <FontAwesomeIcon className="text-2xl" icon={faCommentDots} />}
      </div>
      <div className="w-40 flex-wrap">
        <p className="ml-3">{props.name}</p>
      </div>
    </div>
  )
}

export default ChannelsListItem;
