import ChannelsList from "./channels-list";
import { useChannelsByUserList } from "../query-hooks/useGetChannels";

function MyChannelsList() {
  const channels = useChannelsByUserList();

  return (
    <>
      {channels.isLoading && <p className="m-4 text-base">Loading channels...</p>}
      {channels.isError && <p className="m-4 text-base">Could not fetch channels</p>}
      {channels.isSuccess && <ChannelsList channels={channels.data} />}
    </>
  )
}

export default MyChannelsList;
