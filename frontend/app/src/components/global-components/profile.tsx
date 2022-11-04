import Navbar from '../section-components/navbar';
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

function Profile() {
  const { id } = useParams();
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  return (
    <>
      {user.isLoading && <p>isLoading...</p>}
      {user.isSuccess && (
        <div>
          <Background background={BackgroundGeneral}>
            <Navbar
              text={<FontAwesomeIcon icon={faHouse} />}
              avatarImg={user.data.avatarImg}
            />
            <div
              className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
          gap-10 px-5 justify-center mt-6 text-white text-3xl"
            >
              <ProfileBox nickname={id} currentUser={user} />
              {(!id || user.data.nickname === id) && (
                <SideBox>
                  <h2 className="flex justify-center font-bold break-all">
                    FRIENDS
                  </h2>
                  <FriendList />
                </SideBox>
              )}
            </div>
            <div className="flex justify-center">
              {!id ? (
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
