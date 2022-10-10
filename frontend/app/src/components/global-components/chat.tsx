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
import DropDownMenu from '../section-components/drop-down-menu';
import UsersList from '../section-components/users-list';

export interface User {
  id: string;
  image: string;
  nickname: string;
  status: 'OFFLINE' | 'ONLINE' | 'PLAYING';
}

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
                gap-10 px-5 justify-center mt-6 text-white text-3xl"
      >
        <SideBox>
          <div className="flex justify-center flex-row gap-4 font-bold">
            <h1>CHANNEL</h1>
            <button>+</button>
          </div>
        </SideBox>
        <CenterBox>
          <div
            className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-auto"
            style={{ backgroundImage: `url(${BackgroundGeneral})` }}
          >
            <div className="flex">
              <div className="flex-1">
                <h1 className="flex justify-center p-5 font-bold">
                  [Channel name]
                </h1>
              </div>
              <div className="p-5 flex justify-center">
                <DropDownButton>
                  <DropDownMenu>
                    <ChannelOptions />
                  </DropDownMenu>
                </DropDownButton>
              </div>
            </div>
            <Message />
          </div>
        </CenterBox>
        <SideBox>
          <h1 className="flex justify-center font-bold">MEMBERS</h1>
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
