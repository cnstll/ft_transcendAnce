import { useState } from 'react';
import { AchievementData } from 'src/components/global-components/interface';
import useUserAchievements from 'src/components/query-hooks/useUserAchievements';

interface AchievementModalProps {
  achievementData: AchievementData;
  nickname: string;
}

function AchievementModal({
  achievementData,
  nickname,
}: AchievementModalProps) {
  return (
    <div className="fixed z-50 md:inset-0">
      <div className="relative max-w-md left-1/4 xl:top-28 lg:top-28 md:top-2 -top-10 -translate-x-3/4">
        <div className="relative bg-white rounded-lg shadow text-black">
          <img
            src={achievementData.image}
            alt="Achievement"
            className="pb-2 max-h-80 min-h-20 w-full"
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

  return (
    <div>
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full cursor-pointer"
        src={achievementData.image}
        alt="Rounded achievement"
        onMouseEnter={() => setShowModal(true)}
        onMouseLeave={() => setShowModal(false)}
      />
      {showModal && (
        <AchievementModal
          achievementData={achievementData}
          nickname={nickname}
        />
      )}
    </div>
  );
}

function Achievement({ nickname }: { nickname: string }) {
  const achievementList = useUserAchievements(nickname);

  return (
    <>
      {achievementList.isLoading && <p>isLoading...</p>}
      {achievementList.isSuccess && (
        <div className="py-10">
          <h3 className="py-4 border-t-2">Achievements</h3>
          <div className="grid grid-cols-3 ">
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
