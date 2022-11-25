import { User } from "../../global-components/interface";

interface PromoteToAdminProps {
  user: User;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function PromoteToAdmin({ user, setIsShown }: PromoteToAdminProps) {
  const onPromote = () => {
    setIsShown(false);
  };
  user;

  return (
    <p
      className="text-center hover:underline my-2 truncate cursor-pointer"
      onClick={onPromote}
    >
      Promote admin
    </p>
  );
}

export default PromoteToAdmin;
