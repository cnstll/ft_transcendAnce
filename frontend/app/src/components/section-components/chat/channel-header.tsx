import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Channel } from '../../global-components/interface';
import { useQueryClient, UseQueryResult } from 'react-query';
import { useGroupChannelsList } from '../../query-hooks/useGetChannels';
import { useState } from 'react';
import CreateChannelForm from './create-channel-form';
import SearchBoxChannel from './search-box-channel';
import LoadingSpinner from '../loading-spinner';

function ChannelHeader({
  setActiveChannelId,
}: {
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const channelsQueryKey = 'channelsByUserList';
  const myChannelsQueryData: Channel[] | undefined =
    queryClient.getQueryData(channelsQueryKey);

  const channelsData: UseQueryResult<Channel[] | undefined> =
    useGroupChannelsList();
  const [showForm, setShowForm] = useState<boolean>(false);

  function showCreateChannelForm() {
    setShowForm(!showForm);
  }

  return (
    <div className="flex items-center flex-col gap-4 font-bold">
      <div className="flex items-center">
        <h1>CHANNELS</h1>
        <div className="flex justify-center ml-4">
          <button className="mx-2" onClick={showCreateChannelForm}>
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
          <div className="z-index-20">
            {showForm && (
              <CreateChannelForm
                setShowForm={setShowForm}
                setActiveChannelId={setActiveChannelId}
              />
            )}
          </div>
        </div>
      </div>
      {!channelsData}
      {channelsData.isLoading && <LoadingSpinner />}
      {channelsData.isError && (
        <p className="m-4 text-base text-gray-400">
          We encountered an error 🤷
        </p>
      )}
      {channelsData.data && channelsData.isSuccess && (
        <SearchBoxChannel
          height="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-12 "
          width="w-36 sm:w-36 md:w-40 lg:w-56 xl:w-56 "
          placeholder="channel"
          setActiveChannelId={setActiveChannelId}
          channels={channelsData.data.filter(
            (channel) =>
              !myChannelsQueryData
                ?.map((channel) => channel.id)
                .includes(channel.id),
          )}
        />
      )}
    </div>
  );
}

export default ChannelHeader;
