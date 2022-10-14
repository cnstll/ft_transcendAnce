import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { UseOutsideButtonClick } from '../customed-hooks/use-outside-click';
import DropDownMenu from './drop-down-menu';

interface DropDownButtonProps {
  children: React.ReactNode;
}

function DropDownButton({ children }: DropDownButtonProps) {
  const [isShown, setIsShown] = useState(false);

  function ShowInfo() {
    setIsShown((current) => !current);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideButtonClick(ClickOutsideHandler);

  return (
    <div className="static">
      <button ref={ref} onClick={ShowInfo} className="text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <div className="relative">{isShown && <DropDownMenu>{children}</DropDownMenu>}</div>
    </div>
  );
}

export default DropDownButton;
