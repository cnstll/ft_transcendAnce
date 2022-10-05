import DropDownButton from "./drop-down-button";
import DropDownMenu from "./drop-down-menu";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faCircle as faCirclePlain, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const options = [
  {path: '/', label: 'Invite to play'},
  {path: '/', label: 'Remove from friends'},
  {path: '/', label: 'Ban user'},
]

function ChannelUserOptions() {
  return (<div>
            <Link to="/">
                <p className="text-center hover:underline">Invite to play</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline">Remove from friends</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline">Ban user</p>
            </Link>
          </div>)
}

function UsersListItem(props) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex items-center justify-center mr-2">
        <img className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full" src={props.image} alt="Rounded avatar" />
        <div className="relative">
          <div className="absolute h-14 w-14 -left-2 z-10">
            {props.status === "ONLINE" && <FontAwesomeIcon icon={faCirclePlain} />}
            {props.status === "OFFLINE" && <FontAwesomeIcon icon={faCircle} />}
            {props.status === "PLAYING" && <FontAwesomeIcon icon={faGamepad} />}
          </div>
        </div>
      </div>
      <div className="w-24 sm:w-12 md:w-16 lg:w-20 xl:w-24">
        <p className="mx-2 truncate">{props.nickname}</p>
      </div>
      <div className="content-center mx-2 mt-1">
        <DropDownButton><DropDownMenu><ChannelUserOptions /></DropDownMenu></DropDownButton>
      </div>
    </div>
  )
}


export default UsersListItem;
