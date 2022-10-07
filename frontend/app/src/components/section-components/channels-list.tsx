import ChannelsListItem from "./channels-list-item";
import { Channel } from "../global-components/chat";

type ChannelsListProps = {
  channels: Channel[];
}

function ChannelsList({ channels }: ChannelsListProps) {
  return (
    <div className="p-4 flex flex-col gap-4 text-base my-4">
      {channels.map((channel) => (
        <ChannelsListItem
          key={channel.id}
          channelItem={channel}
          />
      ))}
    </div>
  );
}

export default ChannelsList;
