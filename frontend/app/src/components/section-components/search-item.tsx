import { Link, useNavigate } from "react-router-dom";
import { Channel, User } from "../global-components/interface";
import NormUrl from "../custom-hooks/norm-url";


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
    if (user) {
      navigate('../profile/' + user.nickname);
    }
    else if (channel) {
      navigate('../chat/' + channel.name);
    }
  }

  return <>
    {(user && <Link to={"/profile/" + user.nickname} onClick={OnClick} > <li className="p-4">{user.nickname}</li></Link>)
    }
    {(channel && <Link to={NormUrl("/chat/", channel.name)}><li className="p-4">{channel.name}</li></Link>)}
  </>
}

export default SearchItem;
