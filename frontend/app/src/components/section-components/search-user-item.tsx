import { Link, useNavigate } from 'react-router-dom';
import { User } from '../global-components/interface';

function SearchUserItem({ user }: { user: User }) {
  const navigate = useNavigate();
  function OnClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate('../profile/' + user.nickname);
  }

  return (
    <>
      <Link to={'/profile/' + user.nickname} onClick={OnClick}>
        <li className="p-4 flex-wrap break-words text-[8px] sm:text-xs md:text-xs lg:text-sm">
          {user.nickname}
        </li>
      </Link>
    </>
  );
}

export default SearchUserItem;
