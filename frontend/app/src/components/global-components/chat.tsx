import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Banner from '../section-components/banner';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat-box';
import Message from '../section-components/message';
import BackgroundGeneral from '../../img/disco2.png';
import DropDownButton from '../section-components/drop-down-button';
import UsersList from '../section-components/users-list';
import ChannelsList from '../section-components/channels-list';
import ChannelHeader from '../section-components/channel-header';
import { Channel, User } from "../global-components/interface"

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

const chanUsersData: User[] = [
  {
    id: '123e4567e89b1',
    nickname: 'Alexandra',
    image: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    status: 'OFFLINE',
  },
  {
    id: '123e4567e89b2',
    nickname: 'Alexandre',
    image: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    status: 'ONLINE',
  },
  {
    id: '123e4567e89b3',
    nickname: 'Alexandrinedrinedrine',
    image: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    status: 'PLAYING',
  },
  {
    id: '123e4567e89b4',
    nickname: 'Alexandro',
    image: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    status: 'PLAYING',
  },
];

function ChannelOptions() {
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
    </div>
  );
}

function Chat() {
  return (
    <div className="h-full min-h-screen bg-black">
      <Banner text={<FontAwesomeIcon icon={faHouse} />} />
      <div
        className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
                gap-10 px-5 justify-center mt-6 text-white text-3xl">
        <SideBox>
          <ChannelHeader />
          <ChannelsList channels={channelsData} />
        </SideBox>
        <CenterBox>
          <div
            className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto"
            style={{ backgroundImage: `url(${BackgroundGeneral})` }}
          >
            <div className="flex">
              <div className="flex-1">
                <h2 className="flex justify-center p-5 font-bold">
                  [Channel name]
                </h2>
              </div>
              <div className="p-5 flex justify-center">
                <DropDownButton>
                    <ChannelOptions />
                </DropDownButton>
              </div>
            </div>
            <Message />
          </div>
        </CenterBox>
        <SideBox>
          <h2 className="flex justify-center font-bold">MEMBERS</h2>
          <UsersList channelUsers={chanUsersData} />
        </SideBox>
      </div>
      <div className="flex justify-center">
        <ChatBox />
      </div>
    </div>
  );
}

export default Chat;
