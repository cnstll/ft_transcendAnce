import { Link, useNavigate } from "react-router-dom";
import { Channel, User } from "../global-components/interface";
import NormUrl from "../customed-hooks/norm-url";


interface SearchItemProps {
  user?: User,
  channel?: Channel,
}

function SearchItem({ user, channel }: SearchItemProps) {

  const navigate = useNavigate();
  function OnClick(e: React.MouseEvent) {
    if (!user) {
      return;
    }
    e.preventDefault();
    navigate('../profile/' + user.nickname);
  }

  return <>
    {(user && <Link to={"/profile/" + user.nickname} onClick={OnClick} > <li className="p-4">{user.nickname}</li></Link>)
    }
    {(channel && <Link to={NormUrl("/chat/", channel.name)}><li className="p-4">{channel.name}</li></Link>)}
  </>
}

export default SearchItem;
