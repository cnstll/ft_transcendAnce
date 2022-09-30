function OneBox(props) {
    return (
        <div className="bg-purple text-white h-11/12 w-4/12">
            {props.children}
        </div>
    );
}

export default OneBox