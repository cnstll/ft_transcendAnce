import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat/chat-box';
import BackgroundGeneral from '../../img/disco2.png';
import DropDownButton from '../section-components/drop-down-button';
import {
  Channel,
  channelActionType,
  ModerationInfo,
  User,
} from '../global-components/interface';
import { createContext, useEffect, useState } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import {
  useChannelsByUserList,
  useMyChannelByUserId,
} from '../query-hooks/useGetChannels';
import ChannelOptions from '../section-components/chat/channel-options';
import ChannelHeader from '../section-components/chat/channel-header';
import MyChannelsList from '../section-components/chat/my-channels-list';
import { useQueryClient, UseQueryResult } from 'react-query';
import DisplayMessages from '../section-components/chat/display-messages';
import { socket } from './client-socket';
import { useChannelUsers } from '../query-hooks/useGetChannelUsers';
import LoadingSpinner from '../section-components/loading-spinner';
import PageNotFound from './page-not-found';
import MembersList from '../section-components/chat/members-list';
import { useGetUsersUnderModerationAction } from '../query-hooks/getModerationActionInfo';

export const channelContext = createContext({
  activeChannelId: '',
});

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
  const myRole: UseQueryResult<{ role: string } | undefined> =
    useMyChannelByUserId(activeChannelId);
  myRole;
  const channelUsersQueryKey = 'channelUsers';
  const channelUserBannedQueryKey = 'getUsersUnderModerationAction';
  const bannedUsers: UseQueryResult<string[] | undefined> =
    useGetUsersUnderModerationAction(activeChannelId, channelActionType.Ban);
  //   const channelUsers = useChannelUsers(channelContext.activeChannelId);

  useEffect(() => {
    if (user.isError) {
      navigate('/sign-in');
    }
    // if (user.isSuccess && activeChannelId !== '') {
    //   console.log('Connect to room...', activeChannelId);
    //   socket.emit('connectToRoom', activeChannelId);
    // }
    socket.on('banSucceeded', async (baninfo: ModerationInfo) => {
      console.log('WOW THERE WAS A BAN HERE: ', baninfo);
      await queryClient.invalidateQueries([
        channelUserBannedQueryKey,
        baninfo.channelActionOnChannelId,
        channelActionType.Ban,
      ]);
    });

    socket.on('banFailed', (banInfo: string | null) => {
      console.log('WOW ITS A BAN FAIL');
      if (banInfo !== null) {
        alert(`Oups : ${banInfo} !`);
      }
    });

    if (activeChannel && channels.data && channels.data.length > 0) {
      socket.emit('connectToRoom', {
        channelId: activeChannelId,
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
      socket.off('banSucceeded');
      socket.off('banFailed');
    };
  }, [activeChannelId, queryClient, channels.data?.length]);

  if (activeChannel) {
    if (
      channels.data &&
      !channels.data.find((channel) => channel.id === activeChannel)
    )
      return <PageNotFound />;
  }

  function userIsBanned() {
    return (
      bannedUsers.isSuccess &&
      bannedUsers.data?.some((userId) => userId === user.data?.id)
    );
  }

  return (
    <>
      {user.isLoading && <LoadingSpinner />}
      {user.isSuccess && (
        <div className="h-full min-h-screen bg-black">
          {!userIsBanned() && (
            <>
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
                          <DropDownButton
                            isShown={isShown}
                            setIsShown={setIsShown}
                          >
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
                    <div className="snap-end">
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
                    <channelContext.Provider
                      value={{ activeChannelId: activeChannelId }}
                    >
                      <MembersList
                        channelUsers={channelUsers.data}
                        user={user.data}
                      />
                    </channelContext.Provider>
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
            </>
          )}
          {(userIsBanned() ||
            (bannedUsers.isError && activeChannelId === '')) && (
            <>
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
                          <DropDownButton
                            isShown={isShown}
                            setIsShown={setIsShown}
                          >
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
                    <div className="snap-end text-xl text-center">
                      Sorry you have been banned from this dancefloor 💔
                    </div>
                  </div>
                </CenterBox>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chat;
