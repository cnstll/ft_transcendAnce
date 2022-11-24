import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat/chat-box';
import BackgroundGeneral from '../../img/disco2.png';
import DropDownButton from '../section-components/drop-down-button';
import { Channel, User } from '../global-components/interface';
import { useEffect, useState } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import { useChannelsByUserList } from '../query-hooks/useGetChannels';
import ChannelOptions from '../section-components/chat/channel-options';
import ChannelHeader from '../section-components/chat/channel-header';
import MyChannelsList from '../section-components/chat/my-channels-list';
import { useQueryClient, UseQueryResult } from 'react-query';
import DisplayMessages from '../section-components/chat/display-messages';
import { socket } from './client-socket';
import { useChannelUsers } from '../query-hooks/useGetChannelUsers';
import LoadingSpinner from '../section-components/loading-spinner';
import MembersList from '../section-components/chat/members-list';

function Chat() {
  const user = useUserInfo();
  const { activeChannel } = useParams();
  const [activeChannelId, setActiveChannelId] = useState(activeChannel ?? '');
  const [isShown, setIsShown] = useState(false);

  const navigate = useNavigate();
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();
  const channelUsers: UseQueryResult<User[] | undefined> =
    useChannelUsers(activeChannelId);

  const queryClient = useQueryClient();
  const channelUsersQueryKey = 'channelUsers';

  useEffect(() => {
    if (user.isError) {
      navigate('/sign-in');
    }
    if (activeChannel && channels.data && channels.data.length > 0) {
      socket.emit('connectToRoom', {
        channelId: activeChannelId,
        channelPassword: '',
      });
    }
    if (
      !activeChannel &&
      channels.data !== undefined &&
      channels.data.length > 0
    ) {
      const redirectToChannel = channels.data.at(0);
      if (redirectToChannel) {
        setActiveChannelId(redirectToChannel.id);
        socket.emit('connectToRoom', {
          channelId: redirectToChannel.id,
          channelPassword: '',
        });
        navigate('../chat/' + redirectToChannel.id);
      }
    }
    if (activeChannel && channels.data?.length == 0) {
      setActiveChannelId('');
      navigate('../chat');
    }
    socket.on('roomLeft', () => {
      void queryClient.invalidateQueries(channelUsersQueryKey);
    });
    return () => {
      socket.off('roomLeft');
    };
  }, [activeChannelId, socket, user, channels.data?.length]);

  return (
    <>
      {user.isLoading && <LoadingSpinner />}
      {user.isSuccess && (
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
              <ChannelHeader setActiveChannelId={setActiveChannelId} />
              <MyChannelsList
                activeChannelId={activeChannelId}
                setActiveChannelId={setActiveChannelId}
              />
            </SideBox>
            <CenterBox>
              <div
                className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto snap-y"
                style={{ backgroundImage: `url(${BackgroundGeneral})` }}
              >
                <div className="flex sticky top-0 backdrop-blur-sm bg-gray-900/50">
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
                    {activeChannel ? (
                      <DropDownButton isShown={isShown} setIsShown={setIsShown}>
                        <ChannelOptions
                          setActiveChannelId={setActiveChannelId}
                          setIsShown={setIsShown}
                        />
                      </DropDownButton>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
                <div className='snap-end'>
                  <DisplayMessages
                    userId={user.data.id}
                    channelId={activeChannelId}
                  />
                </div>
              </div>
            </CenterBox>
            <SideBox>
              <h2 className="flex justify-center font-bold">MEMBERS</h2>
              {channelUsers.isSuccess && channelUsers.data && (
                <MembersList
                  channelUsers={channelUsers.data}
                  user={user.data}
                />
              )}{' '}
              {channelUsers.isLoading && <LoadingSpinner />}
              {channelUsers.isError && (
                <div>Woops somethin went wrong here</div>
              )}
            </SideBox>
          </div>
          <div className="flex justify-center">
            <ChatBox userId={user.data.id} channelId={activeChannelId} />
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
