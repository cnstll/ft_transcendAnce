import { useNavigate } from 'react-router-dom';
import { socket } from '../global-components/client-socket';
import { User } from '../global-components/interface';

interface InviteToPlayProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function InviteToPlay({ user, setIsShown }: InviteToPlayProps) {
  const navigate = useNavigate();
  const onInvite = () => {
    setIsShown(false);
    socket.emit('createInvitationGame', {mode: 'CLASSIC', opponent: user.id});
    navigate('/play');

  };
  user; // just to silence warnings
  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onInvite}
    >
      Invite to play
    </p>
  );
}

export default InviteToPlay;
