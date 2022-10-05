import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function DropDownButton(props) {
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
        {isShown && props.children}
      </div>
    </div>
  );
}

export default DropDownButton;


// import React, { useState } from "react";
// import "./DropDown.css";

// export function DropDown({ options, callback }) {
//     const [selected, setSelected] = useState("");
//     const [expanded, setExpanded] = useState(false);

//     function expand() {
//         setExpanded(true);
//     }

//     function close() {
//         setExpanded(false);
//     }

//     function select(event) {
//         const value = event.target.textContent;
//         callback(value);
//         close();
//         setSelected(value);
//     }

//     return (
//         <div className="dropdown" tabIndex={0} onFocus={expand} onBlur={close} >
//             <div>{selected}</div>
//             {expanded ? (
//                 <div className={"dropdown-options-list"}>
//                     {options.map((O) => (
//                         <div className={"dropdown-option"} onClick={select}>
//                             {O}
//                         </div>
//                     ))}
//                 </div>
//             ) : null}
//         </div>
//     );
// }
