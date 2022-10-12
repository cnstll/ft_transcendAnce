import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { UseOutsideInputClick } from "../global-components/use-outside-click"

interface SearchBoxProps {
  height: string,
  width: string,
  placeholder: string,
}

function SearchBox({height, width, placeholder}: SearchBoxProps) {
  const [isShown, setIsShown] = useState(false);

  function ShowInfo() {
    setIsShown((current) => !current);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideInputClick(ClickOutsideHandler);

  return <>
        <div className="relative text-black">
        <input className={height + width + " bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"}
          type="text" name="search" placeholder={"Search " + placeholder} onFocus={ShowInfo} ref={ref}/>
        <button type="submit" className="absolute top-1 sm:top-2.5 md:top-3 lg:top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </button>
        <div className={"bg-white rounded-lg text-sm absolute " + width}>
        {isShown &&
        <ul>
            <li className="p-4">result 1</li>
            <li className="p-4">result 2</li>
            <li className="p-4">result 3</li>
          </ul>}
        </div>
      </div>
  </>
}

export default SearchBox;
