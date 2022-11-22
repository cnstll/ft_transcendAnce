import Navbar from './navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import SideBox from '../section-components/side-box';
import FriendList from '../section-components/friend-list';
import StatsBox from '../section-components/profile/stats-box';
import { useParams } from 'react-router-dom';
import ProfileBox from '../section-components/profile/profile-box';
import { useNavigate } from 'react-router-dom';
import useUserInfo from '../query-hooks/useUserInfo';
import { useEffect } from 'react';
import MatchHistory from '../section-components/profile/match-history';
import LoadingSpinner from '../section-components/loading-spinner';
import { UseQueryResult } from 'react-query';
import { Channel } from './interface';
import { useChannelsByUserList } from '../query-hooks/useGetChannels';

function Profile() {
  const { id } = useParams();
  const user = useUserInfo();
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();

  let activeChannel = '';
  if (channels.isSuccess && channels.data && channels.data.length > 0)
    activeChannel = channels.data[0].id;

  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  return (
    <>
      {user.isLoading && <LoadingSpinner />}
      {user.isSuccess && (
        <div>
          <Background background={BackgroundGeneral}>
            <Navbar
              text={<FontAwesomeIcon icon={faHouse} />}
              avatarImg={user.data.avatarImg}
              activeChannel={activeChannel}
            />
            <div
              className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
          gap-10 px-5 justify-center mt-6 text-white text-3xl"
            >
              <ProfileBox nickname={id} currentUser={user} />
              {!id || user.data.nickname === id ? (
                <>
                  <MatchHistory
                    nickname={user.data.nickname}
                    avatarImg={user.data.avatarImg}
                  />
                  <SideBox>
                    <h2 className="flex justify-center font-bold break-all">
                      FRIENDS
                    </h2>
                    <FriendList />
                  </SideBox>
                </>
              ) : (
                <MatchHistory nickname={id} avatarImg={user.data.avatarImg} />
              )}
            </div>
            <div className="flex justify-center">
              {!id || user.data.nickname === id ? (
                <StatsBox nickname={user.data.nickname} />
              ) : (
                <StatsBox nickname={id} />
              )}
            </div>
          </Background>
        </div>
      )}
    </>
  );
}

export default Profile;
