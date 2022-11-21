import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import DropDownMenu from './drop-down-menu';

interface DropDownButtonProps {
  children: React.ReactNode;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  isShown: boolean;
}

function DropDownButton({
  children,
  setIsShown,
  isShown,
}: DropDownButtonProps) {
  function ShowInfo() {
    setIsShown((current) => !current);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);

  return (
    <div className="static" ref={ref}>
      <button onClick={ShowInfo} className="text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <div className="relative">
        {isShown && <DropDownMenu>{children}</DropDownMenu>}
      </div>
    </div>
  );
}

export default DropDownButton;
