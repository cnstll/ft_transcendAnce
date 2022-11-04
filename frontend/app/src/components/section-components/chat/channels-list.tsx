import ChannelsListItem from './channels-list-item';
import { Channel } from '../../global-components/interface';

function ChannelsList({ channels }: { channels: Channel[] }) {
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
          <ChannelsListItem key={channel.id} channelItem={channel} />
        ))}
    </div>
  );
}

export default ChannelsList;