import DropDownButton from './drop-down-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faCircle,
  faCrown,
  faChessKnight,
} from '@fortawesome/free-solid-svg-icons';
import {
  channelRole,
  channelType,
  User,
  UserConnectionStatus,
  UserListType,
} from '../global-components/interface';
import { useState } from 'react';
import FriendsOptions from './profile/friends-options';
import MembersOptions from './chat/members-options';

interface UsersListProps {
  user: User;
  userListType?: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  blockRelationUserList?: string[];
  role?: {
    userId: string;
    role: channelRole;
  };
  channelId?: string;
}

function UsersListItem({
  user,
  userListType,
  type,
  setActiveChannelId,
  blockRelationUserList,
  role,
  channelId,
}: UsersListProps) {
  const [isShown, setIsShown] = useState(false);
  const [isBlocked, setIsBlocked] = useState(() => {
    if (blockRelationUserList?.includes(user.id)) {
      return blockRelationUserList.includes(user.id);
    }
    return false;
  });

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center mr-2">
        {isBlocked ? (
          <img
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full blur-sm"
            src={user.avatarImg}
            alt="Rounded avatar"
          />
        ) : (
          <img
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
            src={user.avatarImg}
            alt="Rounded avatar"
          />
        )}
        <div className="relative">
          <div className="absolute -left-2 z-10">
            {user.status === UserConnectionStatus.ONLINE && (
              <FontAwesomeIcon className="text-green-600" icon={faCircle} />
            )}
            {user.status === UserConnectionStatus.OFFLINE && (
              <FontAwesomeIcon className="text-gray-500" icon={faCircle} />
            )}
            {user.status === UserConnectionStatus.PLAYING && (
              <FontAwesomeIcon icon={faGamepad} />
            )}
          </div>
        </div>
      </div>
      <div className="w-32">
        <p className="ml-3 truncate">{user.nickname}</p>
        {role?.role === channelRole.Owner && (
          <p className="ml-3 text-xs text-purple-light">
            <FontAwesomeIcon className="mr-1" icon={faCrown} />
            Owner
          </p>
        )}
        {role?.role === channelRole.Admin && (
          <p className="ml-3 text-xs text-purple-light">
            <FontAwesomeIcon className="mx-1" icon={faChessKnight} />
            Admin
          </p>
        )}
      </div>
      {userListType && (
        <div className="content-center mx-2 mt-1">
          <DropDownButton setIsShown={setIsShown} isShown={isShown} style="">
            {userListType === UserListType.MEMBERS && (
              <MembersOptions
                user={user}
                setIsShown={setIsShown}
                type={type}
                setActiveChannelId={setActiveChannelId}
                channelId={channelId ?? ''}
                role={role?.role ?? channelRole.User}
                isBlocked={isBlocked}
                setIsBlocked={setIsBlocked}
              />
            )}
            {userListType === UserListType.FRIENDS && (
              <FriendsOptions
                user={user}
                setIsShown={setIsShown}
                isBlocked={isBlocked}
                setIsBlocked={setIsBlocked}
              />
            )}
          </DropDownButton>
        </div>
      )}
    </div>
  );
}

export default UsersListItem;
