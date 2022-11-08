import { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import useUserStats from 'src/components/query-hooks/useUserStats';
import LoadingSpinner from '../loading-spinner';

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
  const stats = useUserStats(nickname);

  useEffect(() => {
    void stats.refetch();
  }, [nickname]);

  return (
    <>
      {stats.isError && <p className='text-base text-gray-400'>We encountered an error 🤷</p>}
      {stats.isLoading && <LoadingSpinner/>}
      {stats.isSuccess && (
        <div
          className="bg-purple p-2 h-24 text-center text-white m-10 text-xs sm:text-xs md:text-sm lg:text-lg
    xl:w-7/12 lg:w-7/12 md:w-1/2 min-w-[280px]"
        >
          <h2 className="text-xl">STATS</h2>
          <div className="p-2 flex flex-row justify-around text-sm sm:text-base md:text-lg lg:text-xl h-16">
            <DisplayValue value={stats.data.numberOfWin} icon="🏆" />
            <DisplayValue value={stats.data.numberOfLoss} icon="❌" />
            <DisplayValue value={stats.data.eloScore} icon="📈" />
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
