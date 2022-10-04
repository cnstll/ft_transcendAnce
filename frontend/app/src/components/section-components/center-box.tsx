function CenterBox(props) {
    return (
        <div className="bg-purple h-[40 rem] w-7/12">
            {props.children}
        </div>
    );
}

export default CenterBox