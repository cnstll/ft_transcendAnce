import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function UserInfo()
{
    return (
        <div className="absolute top-14 sm:top-14 md:top-16 lg:top-20">
            <div className="w-24 h-22 py-2 bg-purple text-white text-xs sm:text-xs md:text-sm font-bold flex flex-col gap-1 border border-white">
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
        </div>
    )
}

function Banner(props) {
  const [isShown, setIsShown] = useState(false);

  const showInfo = (event) => {
    setIsShown((current) => !current);
  };

    return (
        <div className="flex flex-row px-8 py-5 justify-between flex-shrink-0">
            <Link to="/">
                <h1 className="text-sm sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                    {props.text}
                </h1>
            </Link>
            <div className="relative">
                <input className=" bg-white h-10 w-24 sm:w-36 sm:h-11 md:w-40 md:h-12 lg:w-56 lg:h-14 xl:w-56 xl:h-14
                    px-2 py-2 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"
                    type="text" name="search" placeholder="Search player"/>
                    <button type="submit" className="absolute top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </button>
            </div>
            <div className="relative">
                <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2">
                    <img className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
                     <button onClick={showInfo} className="text-white font-bold">
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                </div>
                {isShown && <UserInfo /> }
            </div>
      </div>
  );
}

export default Banner;
