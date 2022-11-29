
import { socket } from "src/components/global-components/client-socket";
import { channelRole, User } from "../../global-components/interface";

interface PromoteToAdminProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
  role: channelRole;
}

function PromoteToAdmin({ user, setIsShown, channelId, role}: PromoteToAdminProps) {

  const onPromote = () => {
    setIsShown(false);
    socket.emit('updateRole',
    {
      channelId,
      targetInfo: {promotedUserId: user.id}
    });
  };

  return (
    <>
    {role === channelRole.User &&
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onPromote}
    >
      Promote admin
    </p>}
    {role === channelRole.Admin &&
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onPromote}
    >
      Demote admin
    </p>}
  </> );
}

export default PromoteToAdmin;
