import ChannelsListItem from './channels-list-item';
import { Channel } from '../../global-components/interface';

interface MyChannelsListProps {
  activeChannelId: string;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
  channels: Channel[];
}
function ChannelsList({
  activeChannelId,
  setActiveChannelId,
  channels,
}: MyChannelsListProps) {
  return (
    <div className="flex flex-col text-base my-4">
      {channels.length === 0 && (
        <p className="text-base text-purple-light my-4 text-center">
          No channel joined yet 😇
        </p>
      )}
      {channels
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .map((channel) => (
          <ChannelsListItem
            key={channel.id}
            channelItem={channel}
            activeChannel={activeChannelId}
            setActiveChannel={setActiveChannelId}
          />
        ))}
    </div>
  );
}

export default ChannelsList;
