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
import {
  useChannelsByUserList,
  useGroupChannelsList,
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
  const type = channels.data?.find(
    (channel) => channel.id === activeChannel,
  )?.type;

  const queryClient = useQueryClient();
  const channelsData: UseQueryResult<Channel[] | undefined> =
    useGroupChannelsList();

  //const channelUsersQueryKey = 'channelUsers';
  const groupChannelsKey = 'groupChannelsList';
  const channelsByUserListKey = 'channelsByUserList';

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
            <SideBox>
              <ChannelHeader
                setActiveChannelId={setActiveChannelId}
                channels={channelsData}
              />
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
                {channels.isSuccess &&
                  channels.data &&
                  channels.data.length > 0 && (
                    <div className="flex sticky top-0">
                      <div
                        className="flex-1 flex flex-wrap justify-center content-center
                    backdrop-blur-sm bg-gray-900/50 overflow-hidden max-h-20"
                      >
                        <h2 className="font-bold">
                          {
                            channels.data.find(
                              (channel) => channel.id === activeChannel,
                            )?.name
                          }
                        </h2>
                      </div>
                      <div className="flex justify-center">
                        <DropDownButton
                          isShown={isShown}
                          setIsShown={setIsShown}
                          style="backdrop-blur-sm bg-gray-900/50 p-6 md:p-5"
                        >
                          <ChannelOptions
                            // setActiveChannelId={setActiveChannelId}
                            setIsShown={setIsShown}
                            channels={channels}
                          />
                        </DropDownButton>
                      </div>
                    </div>
                  )}
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
              {channelUsers.isSuccess && channelUsers.data && type && (
                <MembersList
                  channelUsers={channelUsers.data}
                  user={user.data}
                  type={type}
                  setActiveChannelId={setActiveChannelId}
                  channelId={activeChannel ?? ''}
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
