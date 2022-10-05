import DropDownButton from "./drop-down-button";

function DropDownMenu(props) {
  return (
    <div className="absolute right-0 w-36 mt-2 z-20">
      <div className="p-3 bg-purple text-white text-xs sm:text-xs md:text-sm font-bold border border-white">
        {props.children}
      </div>
    </div>
  );
}

export default DropDownMenu;

