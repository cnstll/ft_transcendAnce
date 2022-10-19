import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import { MatchData, UserData } from '../global-components/interface';
import FriendList from '../section-components/friend-list';
import StatsBox from '../section-components/stats-box';
import Avatar from '../section-components/avatar';
import MatchHistory from '../section-components/match-history';
import { useNavigate } from 'react-router-dom';
import useUser from '../customed-hooks/queries/useUser';
import { useEffect } from 'react';
import UploadPicture from '../section-components/upload-picture';
import getUserNickname from '../customed-hooks/queries/getUserNickname';

const matchExamples: MatchData = {
  numberOfWin: 10,
  numberOfLoss: 2,
  ranking: 1,
};

function UserInfo({ avatarImg, nickName }: UserData) {
  return (
    <>
      <div className="flex justify-center">
        <img
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
          src={avatarImg}
          alt="Rounded avatar"
        />
      </div>
      <Avatar userNickname={nickName} />
    </>
  );
}

function Profile() {
  const user = useUser();
  const nickName = getUserNickname();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess && nickName.isSuccess)
    return (
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
            <SideBox>
              <UserInfo
                nickName={nickName.data}
                avatarImg={user.data.avatarImg}
              />
              <div className="flex flex-col flex-wrap gap-2 lg:gap-6 mt-2 lg:mt-20 text-[10px] sm:text-xs md:text-sm lg:text-base">
                <UploadPicture />
                <div className="flex justify-start hover:underline cursor-pointer break-all">
                  <p>Two factor identification</p>
                </div>
              </div>
            </SideBox>
            <CenterBox>
              <div className="h-full overflow-y-auto">
                <div className="flex">
                  <div className="flex-1">
                    <h2 className="flex justify-center p-5 font-bold">
                      MATCH HISTORY
                    </h2>
                    <MatchHistory imageCurrentPlayer={user.data.avatarImg} />
                  </div>
                </div>
              </div>
            </CenterBox>
            <SideBox>
              <h2 className="flex justify-center font-bold break-all">
                FRIENDS
              </h2>
              <FriendList />
            </SideBox>
          </div>
          <div className="flex justify-center">
            <StatsBox
              numberOfWin={matchExamples.numberOfWin}
              numberOfLoss={matchExamples.numberOfLoss}
              ranking={matchExamples.ranking}
            />
          </div>
        </Background>
      </div>
    );

  return <></>;
}

export default Profile;
