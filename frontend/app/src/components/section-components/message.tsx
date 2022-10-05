const MESSAGE_DATA = [
    {
        id: 1,
        message: "Who would like to go dancing?",
        image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
    },
    {
        id: 2,
        message: "Sure, do you have a place in mind?",
        image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
    },
    {
        id: 3,
        message: "Let's go to the Macumba!",
        image: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
    },
];



function OtherUserMessage(props)
{
    return (
        <div className="flex flex-row items-center gap-4">
            <img className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
            <div className="w-40 h-10 bg-gray-200 rounded-2xl text-center">
            </div>
        </div>    
        )
}

function CurrentUserMessage(props)
{
    return (
        <div className="flex flex-row justify-end items-center gap-4">
            <div className="w-40 h-10 bg-blue rounded-2xl text-center">
            </div>
            <img className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar"/>
        </div>
    )
}

function Message()
{
    return (
        <div className="p-5 overflow-y-auto">
            <CurrentUserMessage/>
            <OtherUserMessage/>
        </div>
    )
}

export default Message