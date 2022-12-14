import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { socket } from '../../global-components/client-socket';
import { User } from '../../global-components/interface';

interface InviteToPlayProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function InviteToPlay({ user, setIsShown }: InviteToPlayProps) {
  const navigate = useNavigate();
  const onInvite = () => {
    setIsShown(false);
    socket.emit(
      'createInvitationGame',
      { mode: 'CLASSIC', opponent: user.id },
      (msg: string) => {
        if (msg === 'gameJoined') {
          navigate('/play');
        } else if (msg === 'inviteFailed') {
          //Nothing to Do here as it is handled by a listener
        } else {
          toast.error('Your invitation was deflected by a mighty pong spirit', {
            toastId: 'toast-error-invite-failed',
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      },
    );
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
