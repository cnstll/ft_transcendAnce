import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Banner from '../section-components/banner';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat-box';
import BackgroundGeneral from "../../img/disco2.png";
import DropDownButton  from '../section-components/drop-down-button';
import DropDownMenu from '../section-components/drop-down-menu';
import UsersList from '../section-components/users-list';
import ChannelsList from '../section-components/channels-list';

const CHANNELS_DATA = [
  {
    id: '10',
    name: 'Les démons de minuit',
    type: 'PUBLIC',
  },
  {
    id: '20',
    name: 'Hidden chaaaaaaaaaaaaaaaaaaaat group',
    type: 'PRIVATE',
  },
  {
    id: '30',
    name: 'You shall not pass',
    type: 'PROTECTED',
  },
  {
    id: '40',
    name: 'Daphné',
    type: 'DIRECTMESSAGE',
  },
  {
    id: '50',
    name: 'John',
    type: 'DIRECTMESSAGE',
  },
];

const CHANUSERS_DATA = [
  {
    id: '10',
    nickname: 'Alexandra',
    image: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    status: 'OFFLINE',
  },
  {
    id: '20',
    nickname: 'Alexandre',
    image: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    status: 'ONLINE',
  },
  {
    id: '30',
    nickname: 'Alexandrinedrinedrine',
    image: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    status: 'PLAYING',
  },
  {
    id: '40',
    nickname: 'Alexandro',
    image: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    status: 'PLAYING',
  },
];

function ChannelOptions()
{
    return (
        <div>
            <Link to="/">
                <p className="text-center hover:underline my-2">Leave channel</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline my-2">Change settings</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline my-2">Invite user</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline my-2">Ban user</p>
            </Link>
        </div>)
}

function Chat () {
    return (
    <div className="h-screen bg-black">
        <Banner text = < FontAwesomeIcon icon={faHouse} /> />
        <div className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
                gap-10 px-5 justify-center mt-6 text-white text-3xl">
          <SideBox>
              <div className="flex items-center justify-center flex-row gap-2 font-bold">
                  <h1>CHANNELS</h1>
                  <div className="flex justify-center">
                    <button className="mx-2"><FontAwesomeIcon icon={faSquarePlus} /></button>
                  </div>
              </div>
            <ChannelsList channels={CHANNELS_DATA} />
          </SideBox>
          <CenterBox>
              <div className="h-full bg-cover bg-no-repeat border-2 border-purple" style={{ backgroundImage: `url(${BackgroundGeneral})` }}>
                <div className="flex">
                  <div className="flex-1">
                    <h1 className="flex justify-center p-5 font-bold">
                        [Channel name]
                    </h1>
                  </div>
                  <div className="p-5 flex justify-center">
                    <DropDownButton><DropDownMenu><ChannelOptions/></DropDownMenu></DropDownButton>
                  </div>
                </div>
              </div>
              <ChatBox/>
          </CenterBox>
          <SideBox>
            <h1 className="flex justify-center font-bold">
                MEMBERS
            </h1>
            <UsersList channelUsers={CHANUSERS_DATA} />
          </SideBox>
        </div>
    </div>
    );
}

export default Chat
