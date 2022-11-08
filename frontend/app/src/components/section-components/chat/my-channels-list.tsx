import ChannelsList from './channels-list';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Channel } from '../../global-components/interface';
import { socket } from '../../global-components/client-socket';
import LoadingSpinner from '../loading-spinner';

interface MyChannelsListProps {
  activeChannelId: string;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}
function MyChannelsList({
  activeChannelId,
  setActiveChannelId,
}: MyChannelsListProps) {
  const queryClient = useQueryClient();
  const channelsQueryKey = 'channelsByUserList';

  const channelsQueryData = queryClient.getQueryData(channelsQueryKey);
  const channelsQueryState = queryClient.getQueryState(channelsQueryKey);

  useEffect(() => {
    socket.on('roomJoined', () => queryClient.refetchQueries(channelsQueryKey));
    return () => {
      socket.off('roomJoined');
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
      {channelsQueryState?.status === 'success' && (
        <ChannelsList
          activeChannelId={activeChannelId}
          setActiveChannelId={setActiveChannelId}
          channels={channelsQueryData as Channel[]}
        />
      )}
    </>
  );
}

export default MyChannelsList;
