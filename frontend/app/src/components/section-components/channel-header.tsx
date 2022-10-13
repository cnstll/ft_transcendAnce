import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import SearchBox from './search-box';
import { Channel } from '../global-components/chat'

const channelsData : Channel[] = [
  {
    id: '456e4567e89b1',
    name: 'Les démons de minuit',
    type: 'PUBLIC',
  },
  {
    id: '456e4567e89b2',
    name: 'Hidden chaaaaaaaaaaaaaaaaaaaat group',
    type: 'PRIVATE',
  },
  {
    id: '456e4567e89b3',
    name: 'You shall not pass',
    type: 'PROTECTED',
  },
  {
    id: '456e4567e89b4',
    name: 'Daphné',
    type: 'DIRECTMESSAGE',
  },
  {
    id: '456e4567e89b5',
    name: 'John',
    type: 'DIRECTMESSAGE',
  },
];

function ChannelHeader() {
  return (
    <div className="flex items-center flex-col gap-4 font-bold">
      <div className="flex items-center">
        <h1>CHANNELS</h1>
        <div className="flex justify-center ml-4">
          <button className="mx-2"><FontAwesomeIcon icon={faSquarePlus} /></button>
        </div>
      </div>
      <SearchBox height="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-12 " width="w-36 sm:w-36 md:w-40 lg:w-56 xl:w-56 " placeholder="channel" channels={channelsData}/>
    </div>
  )

}

export default ChannelHeader;
