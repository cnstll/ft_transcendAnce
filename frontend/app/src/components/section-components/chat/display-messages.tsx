import { useEffect } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { socket } from '../../global-components/client-socket';
import { Message, User } from '../../global-components/interface';
import { useChannelUsers } from '../../query-hooks/useGetChannelUsers';
import { useGetAllMessages } from '../../query-hooks/useGetMessages';
import LoadingSpinner from '../loading-spinner';

interface UserMessagesProps {
  content: string;
  image: string | undefined;
}
function OtherUserMessage({ content, image }: UserMessagesProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={image}
        alt="Rounded avatar"
      />
      <div
        className="break-words w-2/6 max-w-[30rem] min-w-[150px] min-h-[2rem]
                p-4 bg-gray-300 rounded-2xl text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-black"
      >
        {content}
      </div>
    </div>
  );
}

function CurrentUserMessage({ content, image }: UserMessagesProps) {
  return (
    <div className="flex flex-row justify-end items-center gap-4">
      <div
        className="break-words w-2/6 h-1/6 min-w-[150px] min-h-[2rem]
                p-4 bg-blue rounded-2xl text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm"
      >
        {content}
      </div>
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={image}
        alt="Rounded avatar"
      />
    </div>
  );
}

function DisplayMessages({
  userId,
  channelId,
}: {
  userId: string;
  channelId: string;
}) {
  const messageQuery: UseQueryResult<Message[] | undefined> =
    useGetAllMessages(channelId);

  const channelUsersQuery: UseQueryResult<User[] | undefined> =
    useChannelUsers(channelId);

  const queryClient = useQueryClient();
  const messageQueryKey = 'getAllMessages';
  const channelUsersQueryKey = 'channelUsers';

  useEffect(() => {
    socket.on('messageRoomFailed', () => {
      alert('Could not send your message sry ;(');
    });
    socket.on('incomingMessage', async () => {
      await queryClient.invalidateQueries(messageQueryKey);
    });
    socket.on('roomJoined', async () => {
      await queryClient.invalidateQueries(channelUsersQueryKey);
    });
    return () => {
      socket.off('messageRoomFailed');
      socket.off('incomingMessage');
    };
  }, [socket, queryClient]);

  return (
    <div className="p-5 flex flex-col gap-4">
      {messageQuery.isSuccess &&
        channelUsersQuery.isSuccess &&
        channelUsersQuery.data &&
        messageQuery.data &&
        messageQuery.data.length > 0 &&
        messageQuery.data.map((message) =>
          message.senderId === userId ? (
            <CurrentUserMessage
              key={message.id}
              content={message.content}
              image={
                channelUsersQuery.data?.filter(
                  (user) => user.id === message.senderId,
                )[0]?.avatarImg
              }
            />
          ) : (
            <OtherUserMessage
              key={message.id}
              content={message.content}
              image={
                channelUsersQuery.data?.filter(
                  (user) => user.id === message.senderId,
                )[0]?.avatarImg
              }
            />
          ),
        )}
      {messageQuery.isSuccess &&
        messageQuery.data &&
        messageQuery.data.length === 0 && (
          <div>No message in this channel yet! Don't be shy, send one!</div>
        )}
      {messageQuery.isLoading && <LoadingSpinner />}
      {messageQuery.isError && <div>Woops could not find any messages :( </div>}
    </div>
  );
}

export default DisplayMessages;
