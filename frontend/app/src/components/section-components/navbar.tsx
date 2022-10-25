import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import DropDownMenu from './drop-down-menu';
import SearchBox from './search-box';
import { User } from '../global-components/interface';
import axios from 'axios';

const usersData: User[] = [
  {
    id: '123e4567e89b1',
    nickname: 'Alexandra',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    status: 'OFFLINE',
  },
  {
    id: '123e4567e89b2',
    nickname: 'Alexandre',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    status: 'ONLINE',
  },
  {
    id: '123e4567e89b3',
    nickname: 'Alexandrinedrinedrine',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    status: 'PLAYING',
  },
  {
    id: '123e4567e89b4',
    nickname: 'Alexandro',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    status: 'PLAYING',
  },
];

interface BannerProps {
  children?: React.ReactNode;
  text: JSX.Element | string;
  avatarImg: string;
}

function Navbar({ text, avatarImg }: BannerProps) {
  const [isShown, setIsShown] = useState(false);

  const showInfo = () => {
    setIsShown((current) => !current);
  };

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);

  return (
    <div className="flex flex-row px-8 py-5 justify-between flex-shrink-0">
      <Link to="/">
        <h2 className="text-sm sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
          {text}
        </h2>
      </Link>
      <SearchBox
        height="h-10 sm:h-11 md:h-12 lg:h-14 xl:h-14 "
        width="w-24 sm:w-36 md:w-40 lg:w-56 xl:w-56 "
        placeholder="player"
        users={usersData}
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
  const logout = () => {
    axios
      .get('http://localhost:3000/user/logout', {
        withCredentials: true,
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Link to="/profile">
        <p className="text-center hover:underline my-2">Profile</p>
      </Link>
      <Link to="/ranking">
        <p className="text-center hover:underline my-2">Ranking</p>
      </Link>
      <Link to="/sign-in">
        <p className="text-center hover:underline my-2" onClick={logout}>
          Log out
        </p>
      </Link>
    </div>
  );
}

export default Navbar;
