import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import { User } from '../global-components/interface';
import { useNavigate } from 'react-router-dom';
import SearchUserItem from './search-user-item';

interface SearchBoxUserProps {
  height: string;
  width: string;
  placeholder: string;
  users: User[] | undefined;
}

const defaultSearchData = {
  keyword: '',
};

function SearchBoxUser({
  height,
  width,
  placeholder,
  users,
}: SearchBoxUserProps) {
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
    return users.filter((user) => {
      const filterUsers = user.nickname.toLowerCase();
      return filterUsers.includes(query.toLowerCase());
    });
  };

  function OnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const filteredResults: User[] | undefined = filterUsers(
      users,
      searchData.keyword,
    );
    if (filteredResults && filteredResults.length > 0) {
      const firstResult = filteredResults[0].nickname;
      if (firstResult && searchData.keyword) {
        navigate('../profile/' + firstResult);
      }
    } else {
      setSearchData(defaultSearchData);
    }
  }
  return (
    <>
      <div className="relative text-black" ref={ref}>
        <form onSubmit={OnSubmit}>
          <input
            className={
              height +
              width +
              ' bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs lg:text-sm focus:outline-none relative'
            }
            type="text"
            name="search"
            id="keyword"
            value={keyword}
            onChange={OnChange}
            onFocus={ShowInfo}
            autoComplete="off"
            placeholder={'Search ' + placeholder}
          />
          <button
            type="submit"
            className="absolute top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className={'bg-white rounded-lg text-sm absolute ' + width}>
          {isShown && (
            <ul>
              {filterUsers(users, searchData.keyword)
                ?.slice(0, 5)
                .map((userItem) => (
                  <SearchUserItem key={userItem.id} user={userItem} />
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBoxUser;
