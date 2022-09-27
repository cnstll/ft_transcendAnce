import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';


function Banner ()
{
    return (
        <div className="flex flex-row px-5 py-5">
            <Link to="/">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold">
                    <FontAwesomeIcon icon={faHouse} />
                </h1>
            </Link>
            <div className="pt-2 relative mx-auto text-gray-600">
                <input className=" bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    type="search" name="search" placeholder="Search player"/>
                    <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </button>
            </div>
            <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl flex flex-row gap-2 place-items-end">
                <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
                <FontAwesomeIcon icon={faChevronDown} className="text-white font-bold"/>
            </div>
        </div>
    );
}

export default Banner