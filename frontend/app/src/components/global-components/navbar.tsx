import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import { apiUrl, User } from '../global-components/interface';
import axios from 'axios';
import { useQueryClient, UseQueryResult } from 'react-query';
import useGetAllUsers from '../query-hooks/useGetAllUsers';
import SearchBoxUser from '../section-components/search-box-user';
import DropDownMenu from '../section-components/drop-down-menu';
import { socket } from './client-socket';
import useUserInfo from '../query-hooks/useUserInfo';
import LoadingSpinner from '../section-components/loading-spinner';

interface BannerProps {
  children?: React.ReactNode;
  text: JSX.Element | string;
  avatarImg: string;
}

function Accept({ onAccept, name }: { onAccept: () => void; name: string }) {
  const handleAccept = () => {
    onAccept();
  };

  return (
    <div className="p-4 text-gray-500 bg-white">
      <div className="flex">
        <div className="ml-3 text-sm font-normal">
          <span className="mb-1 text-sm font-semibold text-gray-900">
            {name[0].toUpperCase() + name.substring(1)} wants to play.
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <button
                onClick={handleAccept}
                className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue rounded-lg"
              >
                Accept
              </button>
            </div>
            <div>
              <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg">
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar({ text, avatarImg }: BannerProps) {
  const [isShown, setIsShown] = useState(false);
  let acceptInvite = false;
  const currentUserData = useUserInfo();
  const usersData: UseQueryResult<User[]> = useGetAllUsers();
  const currentLocation = useLocation();
  const queryClient = useQueryClient();
  const friendsListQueryKey = 'friendsList';
  const navigate = useNavigate();
  const channelUsersQueryKey = 'channelUsers';

  const showInfo = () => {
    setIsShown((current) => !current);
  };

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);
  useEffect(() => {
    if (currentLocation.pathname != '/play') {
      socket.emit('connectUser');
    }
    socket.on('userDisconnected', () => {
      void queryClient.invalidateQueries(friendsListQueryKey);
      void queryClient.invalidateQueries(channelUsersQueryKey);
    });
    socket.on('userConnected', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
      void queryClient.invalidateQueries(channelUsersQueryKey);
    });
    socket.on('userInGame', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
      void queryClient.invalidateQueries(channelUsersQueryKey);
    });
    socket.on('userGameEnded', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
      void queryClient.invalidateQueries(channelUsersQueryKey);
    });

    function accept() {
      acceptInvite = true;
    }

    const notify = (challenger: User) =>
      toast.info(<Accept onAccept={accept} name={challenger.nickname} />, {
        position: 'bottom-right',
        icon: '🏓',
        onClose: () => {
          if (acceptInvite) {
            socket.emit('acceptInvite', challenger);
            if (location.pathname.includes('/play'))
              navigate('/play', { state: false });
            else navigate('/play');
          } else {
            socket.emit('refuseInvite', challenger);
          }
        },
      });

    const inviteListener = (challenger: User) => {
      acceptInvite = false;
      notify(challenger);
    };

    socket.on('invitedToGame', inviteListener);

    socket.on('inviteRefused', (): void => {
      toast.info('Sorry, nobody wants to play with you...', {
        position: 'bottom-right',
        icon: '😭',
        autoClose: 1000,
        onClose: () => {
          if (location.pathname === '/play') {
            navigate('/');
          }
        },
      });
    });

    return () => {
      socket.off('userDisconnected');
      socket.off('userConnected');
      socket.off('userInGame');
      socket.off('userGameEnded');
      socket.off('invitedToGame');
      socket.off('inviteRefused');
    };
  }, []);

  return (
    <>
      <div className="flex flex-row px-2 sm:px-2 md:px-5 lg:px-8 py-5 justify-between items-center">
        <Link to="/">
          <h2
            className={`${
              typeof text === 'string' ? 'text-[8px] ' : 'text-[18px] '
            } sm:text-xl md:text-4xl lg:text-5xl text-white font-bold`}
          >
            {text}
          </h2>
        </Link>
        {currentUserData.isSuccess && usersData.isSuccess && (
          <SearchBoxUser
            height="h-10 sm:h-11 md:h-12 lg:h-14 xl:h-14 "
            width="w-24 sm:w-36 md:w-40 lg:w-56 xl:w-56 "
            placeholder="player"
            users={usersData.data.filter(
              (user) => user.id !== currentUserData.data.id,
            )}
          />
        )}
        {(currentUserData.isLoading || usersData.isLoading) && (
          <LoadingSpinner />
        )}
        {(currentUserData.isError || usersData.isError) && <div> Whoops </div>}
        <div className="relative" ref={ref}>
          <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2">
            <Link to="/profile">
              <img
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                src={avatarImg}
                alt="Rounded avatar"
              />
            </Link>
            <button onClick={showInfo} className="text-white font-bold">
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
          {isShown && (
            <div className="top-20">
              <DropDownMenu>
                <UserInfo />
              </DropDownMenu>
            </div>
          )}
        </div>
      </div>
      <ToastContainer closeButton={false} draggable={false} />
    </>
  );
}

function UserInfo() {
  function logoutHandler() {
    socket.emit('disconnectUser');
    axios
      .get(`${apiUrl}/user/logout`, {
        withCredentials: true,
      })
      .catch((error) => console.log(error));
  }
  return (
    <>
      <div>
        <Link to="/profile">
          <p className="text-center hover:underline my-2">Profile</p>
        </Link>
        <Link to="/chat">
          <p className="text-center hover:underline my-2">Chat</p>
        </Link>
        <Link to="/ranking">
          <p className="text-center hover:underline my-2">Ranking</p>
        </Link>
        <Link to="/sign-in">
          <p
            className="text-center hover:underline my-2"
            onClick={logoutHandler}
          >
            Log out
          </p>
        </Link>
      </div>
    </>
  );
}

export default Navbar;
