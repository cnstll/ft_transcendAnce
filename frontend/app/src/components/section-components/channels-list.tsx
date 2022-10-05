import ChannelsListItem from "./channels-list-item";

function ChannelsList(props) {
  return (
    <ul className="text-white text-base">
      {props.channels.map((channel) => (
        <ChannelsListItem
          key={channel.id}
          id={channel.id}
          name={channel.name}
          type={channel.type}
          />
      ))}
    </ul>
  );
}

export default ChannelsList;
