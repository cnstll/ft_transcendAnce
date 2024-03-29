import { useEffect, useState } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { socket } from '../../global-components/client-socket';
import { Message, User } from '../../global-components/interface';
import { useChannelAuthors } from '../../query-hooks/useGetChannelAuthors';
import { useGetAllMessages } from '../../query-hooks/useGetMessages';
import LoadingSpinner from '../loading-spinner';
import { toast } from 'react-toastify';

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
  avatarImg,
  channelId,
}: {
  userId: string;
  avatarImg: string;
  channelId: string;
}) {
  const messageQuery: UseQueryResult<Message[] | undefined> =
    useGetAllMessages(channelId);

  const channelAuthorsQuery: UseQueryResult<User[] | undefined> =
    useChannelAuthors(channelId);

  const [blockSignal, setIsBlockSignal] = useState(false);
  const queryClient = useQueryClient();
  const messageQueryKey = 'getAllMessages';
  const channelUsersQueryKey = 'channelUsers';
  const channelAuthorsQueryKey = 'channelAuthors';
  const listUsersBlockedQueryKey = 'blockedUsersList';
  const usersIBlocked: string[] | undefined = queryClient.getQueryData(
    listUsersBlockedQueryKey,
  );

  useEffect(() => {
    socket.on('messageRoomFailed', () => {
      toast.error("Couldn't send your message sorry 🤷", {
        toastId: 'toast-error-send-message',
        position: toast.POSITION.TOP_RIGHT,
      });
    });
    socket.on('incomingMessage', async () => {
      await queryClient.invalidateQueries(messageQueryKey);
      await queryClient.invalidateQueries(channelAuthorsQueryKey);
    });
    socket.on('roomJoined', async () => {
      await queryClient.invalidateQueries(channelUsersQueryKey);
    });
    socket.on('signalBlock', () => {
      setIsBlockSignal(!blockSignal);
    });
    return () => {
      socket.off('messageRoomFailed');
      socket.off('incomingMessage');
      socket.off('signalBlock');
    };
  }, [queryClient, blockSignal]);

  return (
    <div className="p-5 flex flex-col gap-4">
      {!channelId && (
        <div className="text-xl text-center">
          Join the fun, join your first channel! 🎉
        </div>
      )}
      {messageQuery.isSuccess &&
        channelAuthorsQuery.isSuccess &&
        channelAuthorsQuery.data &&
        messageQuery.data &&
        messageQuery.data.length > 0 &&
        messageQuery.data
          .filter(
            (message) =>
              !usersIBlocked?.some((userId) => userId === message.senderId),
          )
          .map((message) =>
            message.senderId === userId ? (
              <CurrentUserMessage
                key={message.id}
                content={message.content}
                image={avatarImg}
              />
            ) : (
              <OtherUserMessage
                key={message.id}
                content={message.content}
                image={
                  channelAuthorsQuery.data?.filter(
                    (user) => user.id === message.senderId,
                  )[0]?.avatarImg
                }
              />
            ),
          )}
      {messageQuery.isSuccess &&
        messageQuery.data &&
        messageQuery.data.length === 0 && (
          <div className="text-xl text-center">
            Don't be shy, send a message!
          </div>
        )}
      {messageQuery.isLoading && <LoadingSpinner />}
      {(messageQuery.isError || channelAuthorsQuery.isError) && (
        <div className="text-xl text-center">
          Woops could not find any messages 😔
        </div>
      )}
    </div>
  );
}

export default DisplayMessages;
