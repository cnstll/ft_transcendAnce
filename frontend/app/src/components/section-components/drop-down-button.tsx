import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import DropDownMenu from './drop-down-menu';

function DropDownButton({ children }: { children: React.ReactNode }) {
  const [isShown, setIsShown] = useState(false);

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
