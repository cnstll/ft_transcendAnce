import ChannelsList from './channels-list';
import { useChannelsByUserList } from '../../query-hooks/useGetChannels';
import { useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import { Channel } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

function MyChannelsList() {
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();

  useEffect(() => {
    void channels.refetch();
  }, [channels]);

  return (
    <>
      {channels.isLoading && (
        <LoadingSpinner/>
      )}
      {channels.isError && (
        <p className="m-4 text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {channels.data && channels.isSuccess && (
        <ChannelsList channels={channels.data} />
      )}
    </>
  );
}

export default MyChannelsList;
