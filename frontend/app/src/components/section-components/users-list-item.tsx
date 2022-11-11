import DropDownButton from './drop-down-button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faCircle } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../global-components/interface';

function UserOptions({ nickname }: { nickname: string }) {
  return (
    <div>
      <Link to={`/profile/${nickname}`}>
        <p className="text-center hover:underline my-2">Go to profile</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2">Invite to play</p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2 truncate">
          Block {nickname}
        </p>
      </Link>
      <Link to="/">
        <p className="text-center hover:underline my-2 truncate">
          Ban {nickname}
        </p>
      </Link>
    </div>
  );
}

interface UsersListItemProps {
  user: User;
}

function UsersListItem({ user }: UsersListItemProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center mr-2">
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
          src={user.avatarImg}
          alt="Rounded avatar"
        />
        <div className="relative">
          <div className="absolute -left-2 z-10">
            {user.status === 'ONLINE' && (
              <FontAwesomeIcon className="text-green-600" icon={faCircle} />
            )}
            {user.status === 'OFFLINE' && (
              <FontAwesomeIcon className="text-gray-500" icon={faCircle} />
            )}
            {user.status === 'PLAYING' && <FontAwesomeIcon icon={faGamepad} />}
          </div>
        </div>
      </div>
      <div className="w-32">
        <p className="ml-3 truncate">{user.nickname}</p>
      </div>
      <div className="content-center mx-2 mt-1">
        <DropDownButton>
          <UserOptions nickname={user.nickname} />
        </DropDownButton>
      </div>
    </div>
  );
}

export default UsersListItem;
