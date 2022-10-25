import { Link } from "react-router-dom";
import { Channel, User } from "../global-components/interface";
import NormUrl from "../custom-hooks/norm-url";

interface SearchItemProps {
  user?: User,
  channel?: Channel,
}

function SearchItem({user, channel}: SearchItemProps) {
  return <>
  {(user && <Link to={NormUrl("/profile/", user.nickname)}><li className="p-4">{user.nickname}</li></Link>)}
  {(channel && <Link to={NormUrl("/chat/", channel.name)}><li className="p-4">{channel.name}</li></Link>)}
  </>
}

export default SearchItem;
