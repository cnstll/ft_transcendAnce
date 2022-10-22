import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { UseOutsideClick } from "../customed-hooks/use-outside-click"
import { User, Channel } from "../global-components/interface";
import SearchItem from "./search-item";
import { useNavigate } from 'react-router-dom'

interface SearchBoxProps {
  height: string,
  width: string,
  placeholder: string,
  users?: User[],
  channels?: Channel[],
}

const defaultSearchData = {
  keyword: "",
}

function SearchBox({ height, width, placeholder, users, channels }: SearchBoxProps) {
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(false);
  const [searchData, setSearchData] = useState(defaultSearchData);
  const { keyword } = searchData;

  function ShowInfo() {
    setIsShown(true);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);

  function FilterResults(channelItem: Channel): boolean {
    if (channelItem.type !== 'DIRECTMESSAGE')
      return true;
    return false;
  }

  function OnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const filterUsers = (users: User[] | undefined, query: string) => {
    if (!query) {
      return users;
    }
    if (!users) {
      return [];
    }
    console.log(users);
    return users.filter((user) => {
      const filterUsers = user.nickname.toLowerCase();
      return filterUsers.includes(query.toLowerCase());
    });
  };

  function OnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const filteredResults: User[] | undefined = filterUsers(users, searchData.keyword);
    if (filteredResults) {
      if (filteredResults[0]) {
        const firstResult = filteredResults[0].nickname;
        if (firstResult) {
          navigate('../profile/' + firstResult);
        }
      }
    }
  }


  return <>
    <div className="relative text-black" ref={ref}>
      <form onSubmit={OnSubmit}>
        <input className={height + width + " bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative"}
          type="text" name="search" id="keyword" value={keyword} onChange={OnChange}
          onFocus={ShowInfo} autoComplete="off" placeholder={"Search " + placeholder} />
        <button type="submit" className="absolute top-1 sm:top-2.5 md:top-3 lg:top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      <div className={"bg-white rounded-lg text-sm absolute " + width}>
        {isShown &&
          <ul>
            {filterUsers(users, searchData.keyword)?.map((userItem) => (
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
