import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MenuOpen from './drop-down-menu';

function UserInfo()
{
    return (
        <div>
          <Link to="/profile">
              <p className="flex justify-center hover:underline">Profile</p>
          </Link>
          <Link to="/ranking">
              <p className="flex justify-center hover:underline">Ranking</p>
          </Link>
          <Link to="/sign-in">
          <p className="flex justify-center hover:underline">Log Out</p>
          </Link>
        </div>
    )
}

function Banner(props) {
  const [isShown, setIsShown] = useState(false);

    const showInfo = event => {
        setIsShown(current => !current);
    }

    return (
        <div className="flex flex-row px-8 py-5 justify-between flex-shrink-0">
                <Link to="/">
                    <h1 className="text-sm sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                        {props.text}
                    </h1>
                </Link>
            <div className="fixed left-1/2 sm:left-1/2 md:left-1/2 lg:left-1/2 xl:left-3/4 top-6">
                <div className="relative">
                    <input className=" bg-white h-10 px-5 py-5 rounded-lg text-xs sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"
                        type="search" name="search" placeholder="Search player"/>
                        <button type="submit" className="absolute top-2 right-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </button>
                </div>
            </div>
            <div className="relative grid">
                <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2">
                    <img className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
                     <button onClick={showInfo} className="text-white font-bold">
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                </div>
                  {isShown && <div className='top-20'><MenuOpen><UserInfo /></MenuOpen></div>}
            </div>
        </div>
  );
}

export default Banner
