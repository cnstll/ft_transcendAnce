function Button (props) {
return (
    <div className="bg-blue hover:bg-dark-blue text-white p-4 w-28 h-10 sm:w-32 sm:h-11 md:w-36 md:h-12 lg:w-40 lg:h-14 xl:w-56 xl:h-16
         rounded-2xl text-center">
        {props.children}
    </div>
    );
}

export default Button