import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function DropDownMenu(props) {
  const [isShown, setIsShown] = useState(false);

  function showInfo() {
    setIsShown((current) => !current);
  }

  return (
    <div className="relative">
      <button onClick={showInfo} className="text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      {isShown && props.children}
    </div>
  );
}

export default DropDownMenu;
