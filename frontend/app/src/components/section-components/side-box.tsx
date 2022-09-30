function SideBox(props) {
    return (
        <div className="bg-purple text-white px-5 py-5 h-[40rem] w-2/12">
            {props.children}
        </div>
    );
}

export default SideBox