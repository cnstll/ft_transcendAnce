const datas = [
    {
        id: 1,
        message: "Who would like to go dancing dancing dancing dancing dancing dancing dancing dancing?",
        image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
        currentUser: false
    },
    {
        id: 2,
        message: "Sure, do you have a place in mind?",
        image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
        currentUser: false
    },
    {
        id: 3,
        message: "Let's go to the Macumba!",
        image: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
        currentUser: true
    },
    {
        id: 4,
        message: "Noice I am in",
        image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
        currentUser: false
    },
    {
        id: 5,
        message: "Me too",
        image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
        currentUser: false
    },
    {
        id: 6,
        message: "Can't. It's too far away from home",
        image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
        currentUser: false
    },
];



function OtherUserMessage(props)
{
    return (
        <div className="flex flex-row items-center gap-4">
            <img className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
                    src={props.image} alt="Rounded avatar"/>
            <div className="w-2/6 max-w-[30rem] min-w-[150px] min-h-[2rem]
                p-2 bg-gray-300 rounded-2xl text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-black">
                {props.message}
            </div>
        </div>    
        )
}

function CurrentUserMessage(props)
{
    return (
        <div className="flex flex-row justify-end items-center gap-4">
            <div className="w-2/6 h-1/6 max-w-[30rem] min-w-[150px] min-h-[2rem]
                p-2 bg-blue rounded-2xl text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                {props.message}
            </div>
            <img className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
                    src={props.image} alt="Rounded avatar"/>
        </div>
    )
}

function Message()
{
    return (
        <div className="p-5 flex flex-col gap-4">
                {datas.map((data) => 
                    data.currentUser ?
                    <CurrentUserMessage message={data.message} image={data.image}/>
                    : <OtherUserMessage message={data.message} image={data.image}/>
                )}
        </div>
    )
}

export default Message