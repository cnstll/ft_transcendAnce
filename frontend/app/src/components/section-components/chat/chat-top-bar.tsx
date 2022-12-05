import { useContext } from 'react';
import { channelContext } from '../../global-components/chat';
import DropDownButton from '../drop-down-button';
import ChannelOptions from './channel-options';

interface ChatTopBarProps {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatTopBar({ isShown, setIsShown }: ChatTopBarProps) {
  const currentChannelCtx = useContext(channelContext);
  return (
    <div className="flex sticky top-0">
      <div
        className="flex-1 flex flex-wrap sm:justify-center content-center
  backdrop-blur-sm bg-gray-900/50 overflow-hidden max-h-20"
      >
        <h2 className="font-bold">{currentChannelCtx.name}</h2>
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
