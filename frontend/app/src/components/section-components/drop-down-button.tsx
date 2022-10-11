import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface DropDownButtonProps {
  children: React.ReactNode;
}

function DropDownButton({ children }: DropDownButtonProps) {
  const [isShown, setIsShown] = useState(false);

  function ShowInfo() {
    setIsShown((current) => !current);
  }

  return (
    <div className="static">
      <button onClick={ShowInfo} className="text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <div className="relative">{isShown && children}</div>
    </div>
  );
}

export default DropDownButton;
