import { Dispatch } from 'react';
import { UseQueryResult } from 'react-query';
import { Channel } from '../../global-components/interface';
import SideBox from '../side-box';
import ChannelHeader from './channel-header';
import MyChannelsList from './my-channels-list';

interface SideChannelListProps {
  setActiveChannelId: Dispatch<React.SetStateAction<string>>;
  channelsList: UseQueryResult<Channel[] | undefined>;
}

function SideChannelList({
  setActiveChannelId,
  channelsList,
}: SideChannelListProps) {
  return (
    <SideBox>
      <ChannelHeader
        setActiveChannelId={setActiveChannelId}
        channels={channelsList}
      />
      <MyChannelsList setActiveChannelId={setActiveChannelId} />
    </SideBox>
  );
}

export default SideChannelList;
