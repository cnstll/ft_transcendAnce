import { UseQueryResult } from 'react-query';
import { Channel } from '../../global-components/interface';
import DropDownButton from '../drop-down-button';
import ErrorMessage from '../error-message';
import LoadingSpinner from '../loading-spinner';
import ChannelOptions from './channel-options';

interface ChatTopBarProps {
  currentChannel: UseQueryResult<Channel | undefined>;
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatTopBar({ currentChannel, isShown, setIsShown }: ChatTopBarProps) {
  return (
    <div className="flex sticky top-0">
      <div
        className="flex-1 flex flex-wrap sm:justify-center content-center
  backdrop-blur-sm bg-gray-900/50 overflow-hidden max-h-20"
      >
        {currentChannel.isSuccess && currentChannel.data && (
          <h2 className="font-bold">{currentChannel.data.name}</h2>
        )}
        {currentChannel.isLoading && <LoadingSpinner />}
        {currentChannel.isError && <ErrorMessage />}
      </div>
      <div className="flex justify-center">
        <DropDownButton
          isShown={isShown}
          setIsShown={setIsShown}
          style="backdrop-blur-sm bg-gray-900/50 p-6 md:p-5"
        >
          <ChannelOptions
            setIsShown={setIsShown}
            currentChannel={currentChannel}
          />
        </DropDownButton>
      </div>
    </div>
  );
}

export default ChatTopBar;
