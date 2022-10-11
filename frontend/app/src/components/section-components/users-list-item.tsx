import DropDownButton from "./drop-down-button";
import DropDownMenu from "./drop-down-menu";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faCircle as faCirclePlain } from '@fortawesome/free-solid-svg-icons';

function UserOptions() {
  return (<div>
            <Link to="/">
                <p className="text-center hover:underline my-2">See Profile</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline my-2">Invite to play</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline my-2">Remove from friends / Ban user</p>
            </Link>
          </div>)
}

function UsersListItem(props) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center mr-2">
        <img className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full" src={props.image} alt="Rounded avatar" />
        <div className="relative">
          <div className="absolute -left-2 z-10">
            {props.status === "ONLINE" && <FontAwesomeIcon className="text-green-600" icon={faCirclePlain} />}
            {props.status === "OFFLINE" && <FontAwesomeIcon className="text-gray-500" icon={faCirclePlain} />}
            {props.status === "PLAYING" && <FontAwesomeIcon icon={faGamepad} />}
          </div>
        </div>
      </div>
      <div className="w-32">
        <p className="ml-3 truncate">{props.nickname}</p>
      </div>
      <div className="content-center mx-2 mt-1">
        <DropDownButton><DropDownMenu><UserOptions /></DropDownMenu></DropDownButton>
      </div>
    </div>
  )
}


export default UsersListItem;
