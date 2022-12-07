import { useContext } from 'react';
import { UseQueryResult } from 'react-query';
import { channelContext } from '../../global-components/chat';
import { channelType, User } from '../../global-components/interface';
import DropDownButton from '../drop-down-button';
import ChannelOptions from './channel-options';

interface ChatTopBarProps {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  channelUsers: UseQueryResult<User[] | undefined>;
  currentUser: User;
}

function ChatTopBar({
  isShown,
  setIsShown,
  channelUsers,
  currentUser,
}: ChatTopBarProps) {
  const currentChannelCtx = useContext(channelContext);
  return (
    <div className="flex sticky top-0">
      <div
        className="flex-1 flex flex-wrap pl-3 sm:pl-0 sm:justify-center content-center
  backdrop-blur-sm bg-gray-900/50 overflow-hidden max-h-20"
      >
        {currentChannelCtx.type !== channelType.DirectMessage && (
          <h2 className="font-bold">{currentChannelCtx.name}</h2>
        )}
        {currentChannelCtx.type === channelType.DirectMessage &&
          channelUsers.isSuccess &&
          channelUsers.data && (
            <h2 className="font-bold">
              {
                channelUsers.data.filter(
                  (user) => user.id !== currentUser.id,
                )[0]?.nickname
              }
            </h2>
          )}
        {currentChannelCtx.id === channelType.DirectMessage &&
          channelUsers.isError && (
            <h2 className="font-bold"> Direct Message</h2>
          )}
      </div>
      <div className="flex justify-center">
        <DropDownButton
          isShown={isShown}
          setIsShown={setIsShown}
          style="backdrop-blur-sm bg-gray-900/50 p-6 md:p-5"
        >
          <ChannelOptions setIsShown={setIsShown} />
        </DropDownButton>
      </div>
    </div>
  );
}

export default ChatTopBar;
