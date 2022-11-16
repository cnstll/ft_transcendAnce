import { useState } from 'react';
import { UseOutsideClick } from 'src/components/custom-hooks/use-outside-click';
import { AchievementData } from 'src/components/global-components/interface';
import useUserAchievements from 'src/components/query-hooks/useUserAchievements';
import LoadingSpinner from '../loading-spinner';

interface AchievementModalProps {
  achievementData: AchievementData;
  nickname: string;
}

interface AchievementProps {
  nickname: string;
  eloScore: number;
  twoFaSet: boolean;
}

function AchievementModal({
  achievementData,
  nickname,
}: AchievementModalProps) {
  return (
    <div className="absolute z-50 xl:bottom-[40%] lg:bottom-[20%] bottom-[60%] xl:left-[30%] left-1/2">
      <div className="relative lg:max-w-md md:max-w-md sm:max-w-sm max-w-xs -translate-x-3/4">
        <div className="relative bg-white rounded-lg shadow text-black">
          <img
            src={achievementData.image}
            alt="Achievement"
            className="pb-2 lg:max-h-80 md:max-h-40 sm:max-h-20 max-h-20 w-full"
          />
          <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-bold px-4 py-1">
            {achievementData.label}
          </h3>
          <p className="px-4 py-1 xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
            {nickname} {achievementData.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectedAchievement({
  achievementData,
  nickname,
}: AchievementModalProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function ShowAchievementInfo() {
    setShowModal((current) => !current);
  }

  function ClickOutsideHandler() {
    setShowModal(false);
  }

  const ref = UseOutsideClick(ClickOutsideHandler);

  return (
    <div ref={ref}>
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full cursor-pointer"
        src={achievementData.image}
        alt="Rounded achievement"
        onMouseEnter={ShowAchievementInfo}
        onMouseLeave={ShowAchievementInfo}
      />
      <div>
        {showModal && (
          <AchievementModal
            achievementData={achievementData}
            nickname={nickname}
          />
        )}
      </div>
    </div>
  );
}

function Achievement({ nickname, eloScore, twoFaSet }: AchievementProps) {
  const achievementList = useUserAchievements(nickname, eloScore, twoFaSet);

  return (
    <>
      {achievementList.isLoading && <LoadingSpinner />}
      {achievementList.isError && (
        <p className="m-4 text-base text-gray-400">
          We encountered an error 🤷
        </p>
      )}
      {achievementList.isSuccess && (
        <div className="py-10">
          <h3 className="py-4 border-t-2 text-[10px] sm:text-xs md:text-sm lg:text-base">
            Achievements
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {achievementList.data.map((achievement) => (
              <div key={achievement.id}>
                <SelectedAchievement
                  achievementData={achievement}
                  nickname={nickname}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Achievement;
