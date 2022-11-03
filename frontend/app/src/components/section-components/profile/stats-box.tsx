import { MatchData } from '../../global-components/interface';

function StatBox({ numberOfWin, numberOfLoss, ranking }: MatchData) {
  return (
    <div
      className="bg-purple p-2 h-24 text-center text-white m-10 text-xs sm:text-xs md:text-sm lg:text-lg
    xl:w-7/12 lg:w-7/12 md:w-1/2 min-w-[280px]"
    >
      <h2 className="text-xl">STATS</h2>
      <div className="p-2 grid grid-cols-3 text-sm sm:text-base md:text-lg lg:text-xl h-16">
        <p>🏆 {numberOfWin} </p>
        <p>❌ {numberOfLoss} </p>
        <p>👑 {ranking} </p>
      </div>
    </div>
  );
}

export default StatBox;
