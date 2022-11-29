import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { UseOutsideClick } from '../custom-hooks/use-outside-click';
import { Channel, channelType, User } from '../global-components/interface';
import { useNavigate } from 'react-router-dom';
import SearchChannelItem from './chat/search-channel-item';
import { socket } from '../global-components/client-socket';
import JoinChannel from '../custom-hooks/emit-join-channel';
import { useQueryClient } from 'react-query';
import PasswordModal from './chat/password-modal';
import { getMyChannelInvites } from '../query-hooks/getChannelInvites';

interface SearchBoxChannelProps {
  height: string;
  width: string;
  placeholder: string;
  channels: Channel[] | undefined;
  setActiveChannelId: React.Dispatch<React.SetStateAction<string>>;
}

const defaultSearchData = {
  keyword: '',
};

function SearchBoxChannel({
  height,
  width,
  placeholder,
  channels,
  setActiveChannelId,
}: SearchBoxChannelProps) {
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(false);
  const [searchData, setSearchData] = useState(defaultSearchData);
  const { keyword } = searchData;
  const queryClient = useQueryClient();
  const userQueryKey = 'userData';
  const userQueryData: User | undefined =
    queryClient.getQueryData(userQueryKey);
  const [showModal, setShowModal] = useState<boolean>(false);
  const channelInvites = getMyChannelInvites();

  useEffect(() => {
    socket.on(
      'roomJoined',
      async (joiningInfo: { userId: string; channelId: string }) => {
        await queryClient.invalidateQueries('channelsByUserList');
        //User joining the channel will navigate to this channel
        if (userQueryData?.id.toString() == joiningInfo.userId) {
          setIsShown(false);
          setShowModal(false);
          navigate(`../chat/${joiningInfo.channelId}`);
          setActiveChannelId(joiningInfo.channelId);
        } else {
          //TODO notify other users that a new user joined
        }
      },
    );
    socket.on('joinRoomFailed', () => {
      alert('Failed to join room, sorry');
    });
    return () => {
      socket.off('roomJoined');
      socket.off('joinRoomFailed');
    };
  }, [channelInvites]);

  function ShowInfo() {
    setIsShown(true);
  }

  function ClickOutsideHandler() {
    setIsShown(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);

  function OnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const filterChannels = (channels: Channel[] | undefined, query: string) => {
    if (!query) {
      return channels;
    }
    if (!channels) {
      return [];
    }
    return channels.filter((channel) => {
      const filterChannels = channel.name.toLowerCase();
      return filterChannels.includes(query.toLowerCase());
    });
  };

  function OnSubmitChannelQuery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const filteredChannels: Channel[] | undefined = filterChannels(
      channels,
      searchData.keyword,
    );
    if (filteredChannels) {
      if (filteredChannels[0]) {
        const firstResult = filteredChannels[0].id;
        if (firstResult && searchData.keyword) {
          if (filteredChannels[0].type === channelType.Protected)
            setShowModal(true);
          else JoinChannel(filteredChannels[0]);
        }
      } else {
        alert('No channel found ;(');
      }
    }
  }

  return (
    <>
      <div className="relative text-black" ref={ref}>
        <form onSubmit={OnSubmitChannelQuery}>
          <input
            className={
              height +
              width +
              ' bg-white px-2 py-2 pr-6 rounded-lg text-[8px] sm:text-xs md:text-xs\
               lg:text-sm focus:outline-none relative font-normal'
            }
            type="text"
            name="search"
            id="keyword"
            value={keyword}
            onChange={OnChange}
            onFocus={ShowInfo}
            autoComplete="off"
            placeholder={'Search ' + placeholder}
          />
          <button
            type="submit"
            className="absolute lg:top-4 md:top-3 sm:top-2 top-1 right-2 text-[8px] sm:text-xs md:text-xs lg:text-sm text-black"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className={'bg-white rounded-lg text-sm absolute ' + width}>
          {isShown && (
            <ul>
              {filterChannels(channels, searchData.keyword)
                ?.map((channelItem) => (
                  <div key={channelItem.id}>
                    <SearchChannelItem channel={channelItem}
                    invited={(
                      channelInvites.data?.find((value) =>
                      { return ((value.id === channelItem.id))}
                      )?
                      true : false)} />
                    <div className="z-20">
                      {showModal && (
                        <PasswordModal
                          setShowModal={setShowModal}
                          channel={channelItem}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBoxChannel;
