import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type DropDownButtonProps = {
  children: React.ReactNode;
}

function DropDownButton({children}: DropDownButtonProps) {
  const [isShown, setIsShown] = useState(false);

  function showInfo() {
    setIsShown((current) => !current);
  }

  return (
    <div className="static">
      <button onClick={showInfo} className="text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <div className="relative">
        {isShown && children}
      </div>
    </div>
  );
}

export default DropDownButton;
