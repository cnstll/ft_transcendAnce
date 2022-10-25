import useChannelsList from "../query-hooks/useGetChannels";
import ChannelsList from "./channels-list";

function AllChannelsList() {
  const channels = useChannelsList();

  return (
    <>
      {channels.isLoading && <p className="m-4">Loading channels...</p>}
      {channels.isError && <p className="m-4">Could not fetch channels...</p>}
      {channels.isSuccess && <ChannelsList channels={channels.data} />}
    </>
  )
}

export default AllChannelsList;
