import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPencil } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import { MatchData, UserData } from '../global-components/interface';
import FriendList from '../section-components/friend-list';
import StatsBox from '../section-components/stats-box';
import MatchHistory from '../section-components/match-history';
import { QueryClient, QueryClientProvider } from 'react-query';
import UploadPicture from '../section-components/upload-picture';

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
      <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
        <p>{nickName}</p>
        <button>
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>
    </>
  );
}

function Profile({ avatarImg, nickName }: UserData) {
  const queryClient = new QueryClient();
  return (
    <div>
      <Background background={BackgroundGeneral}>
        <Navbar
          text={<FontAwesomeIcon icon={faHouse} />}
          avatarImg={avatarImg}
        />
        <div
          className="flex flex-row xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap
          gap-10 px-5 justify-center mt-6 text-white text-3xl"
        >
          <SideBox>
            <UserInfo nickName={nickName} avatarImg={avatarImg} />
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
                  <MatchHistory imageCurrentPlayer={avatarImg} />
                </div>
              </div>
            </div>
          </CenterBox>
          <SideBox>
            <h2 className="flex justify-center font-bold break-all">FRIENDS</h2>
            <QueryClientProvider client={queryClient}>
              <FriendList />
            </QueryClientProvider>
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
}

export default Profile;
