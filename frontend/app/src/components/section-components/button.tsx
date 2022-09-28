function Button (props) {
return (
    <div className="bg-blue hover:bg-dark-blue text-white p-4 w-56 h-16 rounded-2xl text-center">
        {props.children}
    </div>
    );
}

export default Button