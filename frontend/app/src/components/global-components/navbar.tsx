import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
// import { socket } from './client-socket';

interface BannerProps {
  children?: React.ReactNode;
  text: JSX.Element | string;
  avatarImg: string;
}

function Navbar({ text, avatarImg }: BannerProps) {
  const [isShown, setIsShown] = useState(false);
  const usersData: UseQueryResult<User[]> = useGetAllUsers();
  const currentLocation = useLocation();
  const queryClient = useQueryClient();
  const friendsListQueryKey = 'friendsList';
  const navigate = useNavigate(); 

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
    });
    socket.on('userConnected', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    socket.on('userInGame', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });
    socket.on('userGameEnded', (): void => {
      void queryClient.invalidateQueries(friendsListQueryKey);
    });

    const inviteListener = (challenger: User) => {
      confirm(`${challenger.nickname} has challenged you!`) ? navigate('/play'): socket.emit('refuseInvite', challenger);
    };
    socket.on('invitedToGame', inviteListener);

    socket.on('inviteRefused', (): void => {
      alert('invite refused');
      navigate('/');
    });


    return () => {
      socket.off('userDisconnected');
      socket.off('userConnected');
      socket.off('userInGame');
      socket.off('userGameEnded');
      socket.off('invitedToGame');
      socket.off('inviteRefused');
    };

  }, [socket]);

  return (
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
      <SearchBoxUser
        height="h-10 sm:h-11 md:h-12 lg:h-14 xl:h-14 "
        width="w-24 sm:w-36 md:w-40 lg:w-56 xl:w-56 "
        placeholder="player"
        users={usersData.data}
      />
      <div className="relative" ref={ref}>
        <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2">
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src={avatarImg}
            alt="Rounded avatar"
          />
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
    <div>
      <Link to="/profile">
        <p className="text-center hover:underline my-2">Profile</p>
      </Link>
      <Link to="/ranking">
        <p className="text-center hover:underline my-2">Ranking</p>
      </Link>
      <Link to="/sign-in">
        <p className="text-center hover:underline my-2" onClick={logoutHandler}>
          Log out
        </p>
      </Link>
    </div>
  );
}

export default Navbar;
