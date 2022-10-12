import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

interface SearchBoxProps {
  style: string,
  placeholder: string,
}

function SearchBox({style, placeholder}: SearchBoxProps) {

  return <>
        <div className="relative">
        <input className={style + " bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"}
          type="text" name="search" placeholder={"Search " + placeholder}/>
        <button type="submit" className="absolute top-1 sm:top-2.5 md:top-3 lg:top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </button>
      </div>
  </>
}

export default SearchBox;
