import DropDownButton from './drop-down-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faCircle,
  faCrown,
  faChessKnight,
  faBan,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import {
  channelActionType,
  channelRole,
  channelType,
  User,
  UserConnectionStatus,
  UserListType,
} from '../global-components/interface';
import { useContext, useEffect, useState } from 'react';
import FriendsOptions from './profile/friends-options';
import MembersOptions from './chat/members-options';
import { Link, useLocation } from 'react-router-dom';
import { channelContext } from '../global-components/chat';
import { useIsUserUnderModerationInChannel } from '../query-hooks/useIsUserUnderModerationInChannel';
import { UseQueryResult } from 'react-query';

interface UsersListProps {
  user: User;
  userListType?: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  usersBlocked?: string[];
  usersWhoBlocked?: string[];
  role?: {
    userId: string;
    role: channelRole;
  };
  channelId?: string;
}

function UsersListItem({
  user,
  userListType,
  setActiveChannelId,
  usersBlocked,
  usersWhoBlocked,
  role,
}: UsersListProps) {
  const location = useLocation();
  const [isShown, setIsShown] = useState(false);
  let resultBlock = false;
  const isBlocked = usersWhoBlocked?.includes(user.id);
  if (usersBlocked?.includes(user.id)) resultBlock = true;
  const [blocked, setBlocked] = useState(resultBlock);
  const currentChannel = useContext(channelContext);
  const userIsBanned: UseQueryResult<boolean | undefined> =
    useIsUserUnderModerationInChannel(
      currentChannel.id,
      user.id,
      channelActionType.Ban,
      location.pathname.includes('/chat/'),
    );
  const userIsMuted: UseQueryResult<boolean | undefined> =
    useIsUserUnderModerationInChannel(
      currentChannel.id,
      user.id,
      channelActionType.Mute,
      location.pathname.includes('/chat/'),
    );

  useEffect(() => {
    setBlocked(resultBlock);
  }, [resultBlock]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center mr-2">
        {blocked || isBlocked ? (
          <Link to={'/profile/' + user.nickname}>
            <img
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full blur-sm"
              src={user.avatarImg}
              alt="Rounded avatar"
            />
          </Link>
        ) : (
          <Link to={'/profile/' + user.nickname}>
            <img
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
              src={user.avatarImg}
              alt="Rounded avatar"
            />
          </Link>
        )}
        <div className="relative">
          <div className="absolute -left-2 z-10">
            {!userIsBanned.data?.valueOf() && !userIsMuted.data?.valueOf() && (
              <>
                {user.status === UserConnectionStatus.ONLINE && (
                  <FontAwesomeIcon className="text-green-600" icon={faCircle} />
                )}
                {user.status === UserConnectionStatus.OFFLINE && (
                  <FontAwesomeIcon className="text-gray-500" icon={faCircle} />
                )}
                {user.status === UserConnectionStatus.PLAYING && (
                  <FontAwesomeIcon icon={faGamepad} />
                )}
              </>
            )}
            {userIsBanned.isSuccess && userIsBanned.data?.valueOf() && (
              <FontAwesomeIcon className="text-purple-medium" icon={faBan} />
            )}
            {userIsMuted.isSuccess &&
              userIsMuted.data?.valueOf() &&
              userIsBanned.isSuccess &&
              !userIsBanned.data?.valueOf() && (
                <FontAwesomeIcon
                  className="text-purple-medium"
                  icon={faMicrophoneSlash}
                />
              )}
          </div>
        </div>
      </div>
      <div className="w-32">
        <Link to={'/profile/' + user.nickname}>
          <p className="ml-3 truncate">{user.nickname}</p>
        </Link>
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
                setActiveChannelId={setActiveChannelId}
                role={role?.role ?? channelRole.User}
                blocked={blocked}
                isBlocked={isBlocked}
                setBlocked={setBlocked}
              />
            )}
            {userListType === UserListType.FRIENDS && (
              <FriendsOptions
                user={user}
                setIsShown={setIsShown}
                isBlocked={isBlocked}
                blocked={blocked}
                setBlocked={setBlocked}
              />
            )}
          </DropDownButton>
        </div>
      )}
    </div>
  );
}

export default UsersListItem;
