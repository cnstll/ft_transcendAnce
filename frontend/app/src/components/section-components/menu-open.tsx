function MenuOpen(props) {
  return (
    <div className="absolute right-0 top-10 w-36">
      <div className="p-4 bg-purple text-white text-xs sm:text-xs md:text-sm font-bold border border-white ">
        {props.children}
      </div>
    </div>
  );
}

export default MenuOpen;

