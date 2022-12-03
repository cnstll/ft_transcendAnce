import { faMicrophoneSlash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useQueryClient, UseQueryResult } from 'react-query';
import { socket } from '../../global-components/client-socket';
import {
  AcknoledgementStatus,
  Message,
} from '../../global-components/interface';

interface ChatBoxProps {
  userId: string;
  channelId: string;
  userIsMuted: UseQueryResult<boolean | undefined>;
}

function ChatBox({ userId, channelId, userIsMuted }: ChatBoxProps) {
  const [messageContent, setMessageContent] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userIsMuted.isSuccess && userIsMuted.data?.valueOf()) {
      setIsMuted(true);
    }
    if (userIsMuted.isSuccess && !userIsMuted.data?.valueOf()) {
      setIsMuted(false);
    }
    console.log(userIsMuted.data?.valueOf());
  }, [queryClient]);

  function onSendMessageHandler(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    // If user is not trying to send an empty message go forward
    if (!isMuted && messageContent != '') {
      const newMessage = {
        channelId: channelId,
        content: messageContent,
      };
      const previousChatState: Message[] | undefined = queryClient.getQueryData(
        ['getAllMessages', channelId],
      );
      //Save messages save in cache before mutating cache
      if (previousChatState) {
        const optimisticChatUpdate = [...previousChatState];
        optimisticChatUpdate.push({
          id: Math.random().toString().slice(2),
          ...newMessage,
          senderId: userId,
        });
        //Optimistic update of sender cache
        queryClient.setQueryData(
          ['getAllMessages', channelId],
          optimisticChatUpdate,
        );
        //On fail to send rewind to saved cache
        socket.emit(
          'messageRoom',
          { messageInfo: newMessage },
          (ack: AcknoledgementStatus) => {
            if (ack === AcknoledgementStatus.FAILED) {
              queryClient.setQueryData(
                ['getAllMessages', channelId],
                previousChatState,
              );
            } else {
              //TODO Checking system like whatzapp
            }
          },
        );
        setMessageContent('');
      }
    }
  }

  return (
    <>
      <form
        onSubmit={(event) => onSendMessageHandler(event)}
        className="flex flex-row gap-2 m-10 text-xs sm:text-xs md:text-sm lg:text-lg
            h-16 xl:w-7/12 lg:w-7/12 md:w-1/2 min-w-[280px]"
      >
        <input
          className="w-11/12 bg-purple text-white font-bold px-3"
          type="text"
          name="sendMessage"
          placeholder={
            isMuted ? 'You have been muted.. ' : 'Type your message here..'
          }
          disabled={isMuted}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={isMuted}
          className="bg-blue hover:bg-dark-blue text-white p-4 w-1/12
        rounded-2xl flex justify-center text-center"
          onClick={(event) => onSendMessageHandler(event)}
        >
          <div className="text-xl sm:text-xl md:text-2xl lg:text-3xl">
            {isMuted ? (
              <FontAwesomeIcon icon={faMicrophoneSlash} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </div>
        </button>
      </form>
    </>
  );
}

export default ChatBox;
