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
        <li className="p-4">{user.nickname}</li>
      </Link>
    </>
  );
}

export default SearchUserItem;
