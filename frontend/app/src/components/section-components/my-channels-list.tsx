import ChannelsList from "./channels-list";
import { useChannelsByUserList } from "../query-hooks/useGetChannels";
import { useEffect } from "react";

function MyChannelsList() {
  const channels = useChannelsByUserList();

  useEffect(() => {
    void channels.refetch();
  }, [channels]);

  return (
    <>
      {channels.isLoading && <p className="m-4 text-base">Loading channels...</p>}
      {channels.isError && <p className="m-4 text-base">Could not fetch channels</p>}
      {channels.isSuccess && <ChannelsList channels={channels.data} />}
    </>
  )
}

export default MyChannelsList;
