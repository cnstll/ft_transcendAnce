import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../section-components/navbar';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat-box';
import Message from '../section-components/message';
import BackgroundGeneral from '../../img/disco2.png';
import DropDownButton from '../section-components/drop-down-button';
import UsersList from '../section-components/users-list';
import ChannelHeader from '../section-components/channel-header';
import { Channel, User } from '../global-components/interface';
import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import MyChannelsList from '../section-components/my-channels-list';
import { useMyChannelByUserId } from '../query-hooks/useGetChannels';
import { UseQueryResult } from 'react-query';

const chanUsersData: User[] = [
  {
    id: '123e4567e89b1',
    nickname: 'Alexandra',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    status: 'OFFLINE',
    twoFactorAuthenticationSecret: '',
    twoFactorAuthenticationSet: false,
    eloScore: 1000,
  },
  {
    id: '123e4567e89b2',
    nickname: 'Alexandre',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    status: 'ONLINE',
    twoFactorAuthenticationSecret: '',
    twoFactorAuthenticationSet: false,
    eloScore: 1500,
  },
  {
    id: '123e4567e89b3',
    nickname: 'Alexandrinedrinedrine',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    status: 'PLAYING',
    twoFactorAuthenticationSecret: '',
    twoFactorAuthenticationSet: false,
    eloScore: 1000,
  },
  {
    id: '123e4567e89b4',
    nickname: 'Alexandro',
    avatarImg: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    status: 'PLAYING',
    twoFactorAuthenticationSecret: '',
    twoFactorAuthenticationSet: false,
    eloScore: 1500,
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
  const { id } = useParams();
  const channel : UseQueryResult<{ channel: Channel } | undefined>  = useMyChannelByUserId(id);
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess)
    return (
      <div className="h-full min-h-screen bg-black">
        <Navbar
          text={<FontAwesomeIcon icon={faHouse} />}
          avatarImg={user.data.avatarImg}
        />
        <div
          className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
                gap-10 px-5 justify-center mt-6 text-white text-3xl"
        >
          <SideBox>
            <ChannelHeader />
            <MyChannelsList />
          </SideBox>
          <CenterBox>
            <div
              className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto"
              style={{ backgroundImage: `url(${BackgroundGeneral})` }}
            >
              <div className="flex">
                <div className="flex-1 break-words text-center w-40">
                  <h2 className="p-5 font-bold">
                    {channel.data && channel.data.channel.name}
                    {!channel.data && "Default name"}
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
            <UsersList users={chanUsersData} />
          </SideBox>
        </div>
        <div className="flex justify-center">
          <ChatBox />
        </div>
      </div>
    );

  return <></>;
}

export default Chat;
