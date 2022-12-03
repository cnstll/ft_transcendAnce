import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat/chat-box';
import BackgroundGeneral from '../../img/disco2.png';
import {
  Channel,
  channelActionType,
  User,
} from '../global-components/interface';
import { createContext, useEffect, useState } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import {
  getCurrentChannel,
  useChannelsByUserList,
  useGroupChannelsList,
} from '../query-hooks/useGetChannels';
import { useQueryClient, UseQueryResult } from 'react-query';
import DisplayMessages from '../section-components/chat/display-messages';
import { socket } from './client-socket';
import { useChannelUsers } from '../query-hooks/useGetChannelUsers';
import LoadingSpinner from '../section-components/loading-spinner';
import PageNotFound from './page-not-found';
import MembersList from '../section-components/chat/members-list';
import { useGetUsersUnderModerationAction } from '../query-hooks/getModerationActionInfo';
import SideChannelList from '../section-components/chat/side-channel-list';
import ChatTopBar from '../section-components/chat/chat-top-bar';
import ErrorMessage from '../section-components/error-message';
import { useIsCurrentUserUnderModerationInChannel } from '../query-hooks/useIsCurrentUserUnderModerationInChannel';
import BanMessageBox from '../section-components/chat/ban-message-box';

export const channelContext = createContext({
  id: '',
  name: '',
  type: '',
});

function Chat() {
  const { activeChannel } = useParams();
  const [activeChannelId, setActiveChannelId] = useState(activeChannel ?? '');
  const [isShown, setIsShown] = useState(false);

  const navigate = useNavigate();

  /* Interface with react query cache data to synchronize on events */
  const queryClient = useQueryClient();
  const groupChannelsKey = 'groupChannelsList';
  const channelsByUserListKey = 'channelsByUserList';
  /* Query Hooks to Fetch Data for the Chat */
  const user: UseQueryResult<User> = useUserInfo();
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();
  const groupChannelsList: UseQueryResult<Channel[] | undefined> =
    useGroupChannelsList();
  const channelUsers: UseQueryResult<User[] | undefined> =
    useChannelUsers(activeChannelId);
  const currentChannel: UseQueryResult<Channel | undefined> =
    getCurrentChannel(activeChannelId);
  //   const bannedUsers: UseQueryResult<string[] | undefined> =
  useGetUsersUnderModerationAction(activeChannelId, channelActionType.Ban);
  const userIsBanned: UseQueryResult<boolean | undefined> =
    useIsCurrentUserUnderModerationInChannel(
      activeChannelId,
      channelActionType.Ban,
    );

  useEffect(() => {
    if (user.isError) {
      navigate('/sign-in');
    }
    /** Reconnect to socket? */
    if (activeChannel && channels.data && channels.data.length > 0) {
      socket.emit('connectToRoom', {
        channelId: activeChannelId,
      });
    }
    /** Fallback on a joined channel when landing on /chat */
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
    /** Fallback on /chat when no joined channel */
    if (activeChannel && channels.data?.length == 0) {
      setActiveChannelId('');
      navigate('../chat');
    }

    socket.on(
      'roomLeft',
      (leavingInfo: {
        userId: string;
        channelId: string;
        secondUserId?: string;
      }) => {
        // Applies only if the current user have other channels to be redirected to and to his/her DM's mate
        if (
          channels.data &&
          channels.data.length > 1 &&
          (user.data?.id === leavingInfo.userId ||
            (leavingInfo.secondUserId &&
              user.data?.id === leavingInfo.secondUserId))
        ) {
          const deletedChannel = leavingInfo.channelId;
          // Find another existing channel to redirect the user to after leaving current one
          const nextChannelId =
            channels.data.find((channel) => channel.id != deletedChannel)?.id ??
            '';
          setActiveChannelId(nextChannelId);
          navigate(`../chat/${nextChannelId}`);
        }
        //TODO User still in the room should get notified that a user left
        //void queryClient.invalidateQueries(channelUsersQueryKey);
        void queryClient.invalidateQueries(channelsByUserListKey);
        void queryClient.invalidateQueries(groupChannelsKey);
      },
    );
    socket.on('roomEdited', () => {
      void queryClient.invalidateQueries(channelsByUserListKey);
      void queryClient.invalidateQueries(groupChannelsKey);
    });
    socket.on('roomCreated', (channelId: string, userId: string) => {
      void queryClient.invalidateQueries(channelsByUserListKey);
      void queryClient.invalidateQueries(groupChannelsKey);
      if (userId === user.data?.id) {
        setActiveChannelId(channelId);
        navigate('../chat/' + channelId);
      }
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomLeft');
      socket.off('roomEdited');
    };
  }, [activeChannelId, socket, user, channels.data?.length, queryClient]);

  /** Fallback on 404 when the channel is not accessible (not invited, not existing) */
  if (activeChannel) {
    if (
      channels.data &&
      !channels.data.find((channel) => channel.id === activeChannel)
    )
      return <PageNotFound />;
  }

  return (
    <>
      {user.isLoading && <LoadingSpinner />}
      {user.isSuccess && (
        <div className="h-full min-h-screen bg-black z-0">
          <Navbar
            text={<FontAwesomeIcon icon={faHouse} />}
            avatarImg={user.data.avatarImg}
          />
          <div
            className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
                gap-10 px-5 justify-center mt-6 text-white text-3xl"
          >
            <SideChannelList
              setActiveChannelId={setActiveChannelId}
              channelsList={groupChannelsList}
            />
            {currentChannel.isSuccess && currentChannel.data && (
              <channelContext.Provider
                value={{
                  id: currentChannel.data.id,
                  name: currentChannel.data.name,
                  type: currentChannel.data.type,
                }}
              >
                <CenterBox>
                  <div
                    className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto snap-y"
                    style={{ backgroundImage: `url(${BackgroundGeneral})` }}
                  >
                    <ChatTopBar
                      currentChannel={currentChannel}
                      isShown={isShown}
                      setIsShown={setIsShown}
                    />
                    <div className="snap-end">
                      {userIsBanned.isSuccess &&
                        !userIsBanned.data?.valueOf() && (
                          <DisplayMessages
                            userId={user.data.id}
                            channelId={activeChannelId}
                          />
                        )}
                      {userIsBanned.isSuccess &&
                        userIsBanned.data?.valueOf() && <BanMessageBox />}
                    </div>
                  </div>
                </CenterBox>
                <SideBox>
                  <h2 className="flex justify-center font-bold">MEMBERS</h2>
                  {userIsBanned.isSuccess && !userIsBanned.data?.valueOf() && (
                    <MembersList
                      channelUsers={channelUsers}
                      user={user.data}
                      setActiveChannelId={setActiveChannelId}
                    />
                  )}
                  {userIsBanned.isSuccess && userIsBanned.data?.valueOf() && (
                    <div className="flex flex-col justify-center py-10">
                      <FontAwesomeIcon className="grow h-14" icon={faBan} />{' '}
                    </div>
                  )}
                </SideBox>
              </channelContext.Provider>
            )}
            {currentChannel.isLoading && (
              <div
                className="h-full bg-cover bg-no-repeat border-2 border-purple overflow-y-auto snap-y"
                style={{ backgroundImage: `url(${BackgroundGeneral})` }}
              >
                <LoadingSpinner />
              </div>
            )}
            {currentChannel.isError && <ErrorMessage />}
          </div>
          {userIsBanned.isSuccess && !userIsBanned.data?.valueOf() && (
            <div className="flex justify-center">
              <ChatBox userId={user.data.id} channelId={activeChannelId} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Chat;
