import { User } from '../global-components/interface';

interface InviteToPlayProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function InviteToPlay({ user, setIsShown }: InviteToPlayProps) {
  const onInvite = () => {
    setIsShown(false);
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
