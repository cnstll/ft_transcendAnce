function OneBox(props) {
    return (
        <div className="bg-purple text-white h-[40rem] w-9/12 overflow-scroll">
            {props.children}
        </div>
    );
}

export default OneBox