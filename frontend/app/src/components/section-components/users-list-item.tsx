import DropDownButton from './drop-down-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faCircle } from '@fortawesome/free-solid-svg-icons';
import {
  channelType,
  User,
  UserConnectionStatus,
  UserListType,
} from '../global-components/interface';
import { useState } from 'react';
import FriendsOptions from './profile/friends-options';
import MembersOptions from './chat/members-options';
import { useBlockedUserViceVersa } from '../query-hooks/useBlockedUser';
import LoadingSpinner from './loading-spinner';

interface UsersListProps {
  user: User;
  userListType?: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
}

function UsersListItem({
  user,
  userListType,
  type,
  setActiveChannelId,
}: UsersListProps) {
  const [isShown, setIsShown] = useState(false);
  const isBlocked = useBlockedUserViceVersa(user.id);

  return (
    <>
      {isBlocked.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {isBlocked.isLoading && <LoadingSpinner />}
      {isBlocked.isSuccess && (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center mr-2">
            {isBlocked.data ? (
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
          </div>
          {userListType && (
            <div className="content-center mx-2 mt-1">
              <DropDownButton
                setIsShown={setIsShown}
                isShown={isShown}
                style=""
              >
                {userListType === UserListType.MEMBERS && (
                  <MembersOptions
                    user={user}
                    setIsShown={setIsShown}
                    type={type}
                    setActiveChannelId={setActiveChannelId}
                    isBlocked={isBlocked.data}
                  />
                )}
                {userListType === UserListType.FRIENDS && (
                  <FriendsOptions
                    user={user}
                    setIsShown={setIsShown}
                    isBlocked={isBlocked.data}
                  />
                )}
              </DropDownButton>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default UsersListItem;
