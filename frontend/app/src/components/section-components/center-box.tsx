function CenterBox(props) {
    return (
        <div className="bg-purple h-[40 rem] w-7/12 text-xl sm:text-xl md:text-2xl lg:text-3xl">
            {props.children}
        </div>
    );
}

export default CenterBox