import ChannelsList from "./channels-list";
import { useChannelsByUserList } from "../query-hooks/useGetChannels";
import { useEffect } from "react";
import { UseQueryResult } from "react-query";
import { Channel } from "../global-components/interface";

function MyChannelsList() {
  const channels : UseQueryResult<Channel[] | undefined>  = useChannelsByUserList();

  useEffect(() => {
    void channels.refetch();
  }, [channels]);

  return (
    <>
      {channels.isLoading && <p className="m-4 text-base">Loading channels...</p>}
      {channels.isError && <p className="m-4 text-base">Could not fetch channels</p>}
      {channels.data && channels.isSuccess && <ChannelsList channels={channels.data} />}
    </>
  )
}

export default MyChannelsList;
