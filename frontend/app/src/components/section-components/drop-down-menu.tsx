interface DropDownMenuProps {
  children: React.ReactNode;
}

function DropDownMenu({ children }: DropDownMenuProps) {
  return (
    <div className="absolute right-0 w-36 mt-2 z-20">
      <div className="p-3 bg-purple text-white text-xs sm:text-xs md:text-sm font-bold border border-white">
        {children}
      </div>
    </div>
  );
}

export default DropDownMenu;
