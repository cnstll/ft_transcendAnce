import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function ChannelHeader() {
  return (
    <div className="flex items-center flex-col gap-4 font-bold">
      <div className="flex items-center">
        <h1>CHANNELS</h1>
        <div className="flex justify-center ml-4">
          <button className="mx-2"><FontAwesomeIcon icon={faSquarePlus} /></button>
        </div>
      </div>
      <div className="relative basis-full">
        <input className=" bg-white h-8 w-36 sm:w-36 sm:h-9 md:w-40 md:h-10 lg:w-56 lg:h-12 xl:w-56 xl:h-12
          px-2 py-2 pr-6 rounded-lg text-[8px] text-sm focus:outline-none relative text-black"
          type="text" name="search" placeholder="Search channel"/>
        <button type="submit" className="absolute top-1 sm:top-2.5 md:top-3 lg:top-4 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </button>
      </div>
    </div>
  )

}

export default ChannelHeader;
