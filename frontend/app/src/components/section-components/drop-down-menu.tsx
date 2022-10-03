import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function DropDownMenu(props) {
  const [isShown, setIsShown] = useState(false);

  function showInfo() {
    setIsShown((current) => !current);
  }

  return (
    <div className="relative inline-block mb-20">
      <button onClick={showInfo} className="relative flex items-center text-white font-bold">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      {isShown && props.children}
    </div>
  );
}

export default DropDownMenu;
