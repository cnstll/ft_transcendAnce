import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import SearchBox from './search-box';

function ChannelHeader() {
  return (
    <div className="flex items-center flex-col gap-4 font-bold">
      <div className="flex items-center">
        <h1>CHANNELS</h1>
        <div className="flex justify-center ml-4">
          <button className="mx-2"><FontAwesomeIcon icon={faSquarePlus} /></button>
        </div>
      </div>
      <SearchBox style="h-8 w-36 sm:w-36 sm:h-9 md:w-40 md:h-10 lg:w-56 lg:h-12 xl:w-56 xl:h-12 text-black" placeholder="channel"/>
    </div>
  )

}

export default ChannelHeader;
