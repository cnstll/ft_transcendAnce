import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { UseOutsideInputClick } from "../customed-hooks/use-outside-click"
import { User, Channel } from "../global-components/chat";
import SearchItem from "./search-item";

interface SearchBoxProps {
  height: string,
  width: string,
  placeholder: string,
  users?: User[],
  channels?: Channel[],
}

function SearchBox({height, width, placeholder, users, channels}: SearchBoxProps) {
  const [isShown, setIsShown] = useState(false);

  function ShowInfo() {
    setIsShown(true);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  function FilterResults(channelItem: Channel) : boolean {
    if (channelItem.type !== 'DIRECTMESSAGE')
      return true;
    return false;
  }

  const ref = UseOutsideInputClick(ClickOutsideHandler);

  return <>
        <div className="relative text-black">
        <input className={height + width + " bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"}
          type="text" name="search" placeholder={"Search " + placeholder} onFocus={ShowInfo} autoComplete="off" ref={ref}/>
        <button type="submit" className="absolute top-1 sm:top-2.5 md:top-3 lg:top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </button>
        <div className={"bg-white rounded-lg text-sm absolute " + width}>
        {isShown &&
        <ul>
            {users?.map((userItem) => (
              <SearchItem key={userItem.id} user={userItem} />
            ))}
            {channels?.map((channelItem) => (
              FilterResults(channelItem) &&
              <SearchItem key={channelItem.id} channel={channelItem} />
            ))}
          </ul>}
        </div>
      </div>
  </>
}

export default SearchBox;
