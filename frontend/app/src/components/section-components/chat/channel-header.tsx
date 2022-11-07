import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '../search-box';
import { Channel } from '../../global-components/interface';
import { UseQueryResult } from 'react-query';
import { useGroupChannelsList } from '../../query-hooks/useGetChannels';
import { useState } from 'react';
import { UseOutsideDivClick } from '../../custom-hooks/use-outside-click';
import CreateChannelForm from './create-channel-form';
import LoadingSpinner from '../loading-spinner';

function ChannelHeader() {
  const channelsData: UseQueryResult<Channel[] | undefined> =
    useGroupChannelsList();
  const [showForm, setShowForm] = useState<boolean>(false);

  function showCreateChannelForm() {
    setShowForm(!showForm);
  }

  function ClickOutsideHandler() {
    setShowForm(false);
  }

  const ref = UseOutsideDivClick(ClickOutsideHandler);

  return (
    <div className="flex items-center flex-col gap-4 font-bold">
      <div className="flex items-center">
        <h1>CHANNELS</h1>
        <div className="flex justify-center ml-4" ref={ref}>
          <button className="mx-2" onClick={showCreateChannelForm}>
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
          <div className="z-index-20">
            {showForm && <CreateChannelForm setShowForm={setShowForm} />}
          </div>
        </div>
      </div>
      {!channelsData}
      {channelsData.isLoading && <LoadingSpinner/>}
      {channelsData.isError && (
        <p className="m-4 text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {channelsData.data && channelsData.isSuccess && (
        <SearchBox
          height="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-12 "
          width="w-36 sm:w-36 md:w-40 lg:w-56 xl:w-56 "
          placeholder="channel"
          channels={channelsData.data}
        />
      )}
    </div>
  );
}

export default ChannelHeader;
