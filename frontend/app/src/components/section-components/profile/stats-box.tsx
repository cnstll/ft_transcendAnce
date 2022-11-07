import useUserStats from 'src/components/query-hooks/useUserStats';
import LoadingSpinner from '../loading-spinner';

function StatBox() {
  const stats = useUserStats();
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
          <div className="p-2 grid grid-cols-3 text-sm sm:text-base md:text-lg lg:text-xl h-16">
            <p>🏆 {stats.data.numberOfWin} </p>
            <p>❌ {stats.data.numberOfLoss} </p>
            {/* <p>👑 {ranking} </p> */}
          </div>
        </div>
      )}
    </>
  );
}

export default StatBox;
