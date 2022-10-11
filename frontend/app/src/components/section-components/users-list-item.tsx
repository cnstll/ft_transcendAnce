import DropDownButton from './drop-down-button';
import DropDownMenu from './drop-down-menu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faCircle as faCirclePlain,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../global-components/chat';

function UserOptions() {
  return (
    <div>
      <Link to="/">
        <p className="text-center hover:underline my-2">Invite to play</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Remove from friends</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Ban user</p>
      </Link>
    </div>
  );
}

interface UsersListItemProps {
  channelUser: User;
}

function UsersListItem({ channelUser }: UsersListItemProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center mr-2">
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
          src={channelUser.image}
          alt="Rounded avatar"
        />
        <div className="relative">
          <div className="absolute -left-2 z-10">
            {channelUser.status === 'ONLINE' && (
              <FontAwesomeIcon
                className="text-green-600"
                icon={faCirclePlain}
              />
            )}
            {channelUser.status === 'OFFLINE' && (
              <FontAwesomeIcon className="text-gray-500" icon={faCirclePlain} />
            )}
            {channelUser.status === 'PLAYING' && (
              <FontAwesomeIcon icon={faGamepad} />
            )}
          </div>
        </div>
      </div>
      <div className="w-32">
        <p className="ml-3 truncate">{channelUser.nickname}</p>
      </div>
      <div className="content-center mx-2 mt-1">
        <DropDownButton>
          <DropDownMenu>
            <UserOptions />
          </DropDownMenu>
        </DropDownButton>
      </div>
    </div>
  );
}

export default UsersListItem;