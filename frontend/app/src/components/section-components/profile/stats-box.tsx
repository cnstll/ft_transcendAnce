import { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { UseQueryResult } from 'react-query';
import { TargetInfo } from 'src/components/global-components/interface';
import useTargetInfo from 'src/components/query-hooks/useTargetInfo';
import useUserStats from 'src/components/query-hooks/useUserStats';

interface DisplayValueProps {
  value: number;
  icon: string;
}

function DisplayValue({ value, icon }: DisplayValueProps) {
  return (
    <div className="flex flex-row gap-2">
      <p>{icon}</p>
      <NumericFormat value={value} thousandSeparator=" " displayType="text" />
    </div>
  );
}

function StatBox({ nickname }: { nickname: string }) {
  const user: UseQueryResult<TargetInfo> | null = useTargetInfo(nickname);
  const stats = useUserStats(nickname);

  useEffect(() => {
    void user.refetch();
    void stats.refetch();
  }, [nickname]);

  return (
    <>
      {stats.isLoading && <p>isLoading...</p>}
      {stats.isSuccess && user.isSuccess && (
        <div
          className="bg-purple p-2 h-24 text-center text-white m-10 text-xs sm:text-xs md:text-sm lg:text-lg
    xl:w-7/12 lg:w-7/12 md:w-1/2 min-w-[280px]"
        >
          <h2 className="text-xl">STATS</h2>
          <div className="p-2 flex flex-row justify-around text-sm sm:text-base md:text-lg lg:text-xl h-16">
            <DisplayValue value={stats.data.numberOfWin} icon="🏆" />
            <DisplayValue value={stats.data.numberOfLoss} icon="❌" />
            <DisplayValue value={user.data.eloScore} icon="📈" />
            <div className="flex flex-row gap-2">
              👑
              <p>{stats.data.ranking}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StatBox;
