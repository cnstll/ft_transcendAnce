import ChannelsList from './channels-list';
import { Dispatch, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Channel } from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import LoadingSpinner from '../loading-spinner';

interface MyChannelsListProps {
  setActiveChannelId: Dispatch<React.SetStateAction<string>>;
}

function MyChannelsList({ setActiveChannelId }: MyChannelsListProps) {
  /* Getting state data from query cache */
  const queryClient = useQueryClient();
  const channelsQueryKey = 'channelsByUserList';
  const channelsQueryData = queryClient.getQueryData(channelsQueryKey);
  const channelsQueryState = queryClient.getQueryState(channelsQueryKey);

  useEffect(() => {
    socket.on('roomJoined', () => queryClient.refetchQueries(channelsQueryKey));
    socket.on('roomEdited', () => queryClient.refetchQueries(channelsQueryKey));
    return () => {
      socket.off('roomJoined');
      socket.off('roomEdited');
    };
  }, []);

  return (
    <>
      {channelsQueryState?.status === 'loading' && <LoadingSpinner />}
      {channelsQueryState?.status === 'error' && (
        <p className="m-4 text-base text-gray-400">
          We encountered an error 🤷
        </p>
      )}
      {channelsQueryState?.status === 'success' && channelsQueryData && (
        <ChannelsList
          setActiveChannelId={setActiveChannelId}
          channels={channelsQueryData as Channel[]}
        />
      )}
    </>
  );
}

export default MyChannelsList;
