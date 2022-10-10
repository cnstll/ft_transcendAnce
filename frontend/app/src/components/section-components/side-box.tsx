type SideBoxProps = {
  children: React.ReactNode;
}

function SideBox({children}: SideBoxProps) {
    return (
        <div className="bg-purple text-white p-5 h-44 lg:h-96 xl:h-[40rem] xl:w-2/12 lg:w-2/12 md:w-1/2 min-w-[280px] text-xl sm:text-xl md:text-2xl lg:text-3xl">
            {children}
        </div>
    );
}

export default SideBox;
