import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../section-components/navbar';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat/chat-box';
import BackgroundGeneral from '../../img/disco2.png';
import DropDownButton from '../section-components/drop-down-button';
import UsersList from '../section-components/users-list';
import { Channel, User } from '../global-components/interface';
import { useEffect, useState } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import { useChannelsByUserList } from '../query-hooks/useGetChannels';
import ChannelOptions from '../section-components/chat/channel-options';
import ChannelHeader from '../section-components/chat/channel-header';
import MyChannelsList from '../section-components/chat/my-channels-list';
import { UseQueryResult } from 'react-query';
import DisplayMessages from '../section-components/chat/display-messages';
import { socket } from './client-socket';

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

function Chat() {
  const user = useUserInfo();
  const { activeChannel } = useParams();
  const [activeChannelId, setActiveChannelId] = useState(activeChannel ?? '');

  const navigate = useNavigate();
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();

  useEffect(() => {
    console.log(activeChannelId);
    if (user.isError) {
      navigate('/sign-in');
    }
    // Connect to a room before sending any message
    // TODO : Add a pop up to enter password
    if (activeChannel) {
      socket.emit('connectToRoom', {
        channelId: activeChannelId,
        channelPassword: '',
      });
    }
  }, [activeChannelId]);

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
            <MyChannelsList
              activeChannelId={activeChannelId}
              setActiveChannelId={setActiveChannelId}
            />
          </SideBox>
          <CenterBox>
            <div
              className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto"
              style={{ backgroundImage: `url(${BackgroundGeneral})` }}
            >
              <div className="flex">
                <div className="flex-1">
                  <h2 className="flex justify-center p-5 font-bold">
                    {channels.isSuccess &&
                      channels.data &&
                      channels.data.find(
                        (channel) => channel.id === activeChannel,
                      )?.name}
                  </h2>
                </div>
                <div className="p-5 flex justify-center">
                  <DropDownButton>
                    <ChannelOptions setActiveChannelId={setActiveChannelId} />
                  </DropDownButton>
                </div>
              </div>
              <DisplayMessages
                userId={user.data.id}
                channelId={activeChannelId}
              />
            </div>
          </CenterBox>
          <SideBox>
            <h2 className="flex justify-center font-bold">MEMBERS</h2>
            <UsersList users={chanUsersData} />
          </SideBox>
        </div>
        <div className="flex justify-center">
          <ChatBox userId={user.data.id} channelId={activeChannelId} />
        </div>
      </div>
    );

  return <></>;
}

export default Chat;
