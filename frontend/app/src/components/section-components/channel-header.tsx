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
      <SearchBox height="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-12 " width="w-36 sm:w-36 md:w-40 lg:w-56 xl:w-56 " placeholder="channel"/>
    </div>
  )

}

export default ChannelHeader;
