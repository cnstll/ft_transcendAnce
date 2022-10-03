function SideBox(props) {
    return (
        <div className="bg-purple text-white px-2 py-2 lg:px-5 lg:py-5 h-[40rem] w-2/12 text-xl sm:text-xl md:text-2xl lg:text-3xl">
            {props.children}
        </div>
    );
}

export default SideBox