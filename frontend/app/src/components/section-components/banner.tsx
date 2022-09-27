import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import {useState} from 'react';

function UserInfo()
{
    return (
        <div className="w-8/12 h-full bg-purple text-white text-lg sm:text-xs md:text-sm font-bold flex flex-col">
            <Link to="/profile">
                <p className="flex justify-center">Profile</p>
            </Link>
            <Link to="/ranking">
                <p className="flex justify-center">Ranking</p>
            </Link>
            <Link to="/sign-in">
                <p className="flex justify-center">Log Out</p>
            </Link>
        </div>
    )
}

function Banner (props)
{
    const [isShown, setIsShown] = useState(false);

    const showInfo = event => {
    setIsShown(current => !current);
    }

    return (
        <div className="flex flex-row px-5 py-5">
            <Link to="/">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                    {props.text}
                </h1>
            </Link>
            <div className="pt-2 relative mx-auto text-gray-600">
                <input className=" bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    type="search" name="search" placeholder="Search player"/>
                    <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </button>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2 place-items-end">
                    <img className="w-4/12 h-4/12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
                    <button onClick={showInfo} className="text-white font-bold">
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                </div>
                {isShown && <UserInfo/> }
            </div>
        </div>
    );
}

export default Banner