import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ChatBox() {
  return (
    <div
      className="flex flex-row gap-2 m-10 text-xs sm:text-xs md:text-sm lg:text-lg
            h-16 xl:w-7/12 lg:w-7/12 md:w-1/2 min-w-[280px]"
    >
      <input
        className="w-11/12 bg-purple text-white font-bold px-3"
        type="text"
        name="sendMessage"
        placeholder="Type your message here"
      />
      <button
        type="submit"
        className="bg-blue hover:bg-dark-blue text-white p-4 w-1/12
                rounded-2xl flex justify-center text-center"
      >
        <div className="text-xl sm:text-xl md:text-2xl lg:text-3xl">
          <FontAwesomeIcon icon={faPlay} />
        </div>
      </button>
    </div>
  );
}

export default ChatBox;
