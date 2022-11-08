import { useEffect } from 'react';
import { MatchData } from 'src/components/global-components/interface';
import useUserMatchHistory from 'src/components/query-hooks/useUserMatchHistory';
import CenterBox from '../center-box';

interface StatusData {
  score: string;
  matchWon: boolean;
}

interface PictureData {
  imageCurrentUser: string;
  imageOpponent: string;
}

function VersusComponent({ imageCurrentUser, imageOpponent }: PictureData) {
  return (
    <div className="flex flex-row gap-2">
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={imageCurrentUser}
        alt="Rounded avatar"
      />
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">/</p>
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={imageOpponent}
        alt="Rounded avatar"
      />
    </div>
  );
}

function StatusComponent({ matchWon, score }: StatusData) {
  return (
    <div className="text-base sm:text-base md:text-2xl lg:text-2xl xl:text-3xl">
      {matchWon ? (
        <p className=" text-green-500">WON {score} </p>
      ) : (
        <p className=" text-red-600">LOST {score} </p>
      )}
    </div>
  );
}

function MatchHistoryComponent({ matchData }: { matchData: MatchData[] }) {
  return (
    <>
      <div className="flex flex-col gap-6 m-10">
        {matchData.length === 0 ? (
          <p className="flex justify-center text-base sm:text-base md:text-2xl lg:text-2xl xl:text-3xl">
            No match yet, go show your pong move 🕺
          </p>
        ) : (
          matchData.map((matchData) => (
            <div
              key={matchData.id}
              className="flex flex-row gap-32 items-center"
            >
              <VersusComponent
                imageCurrentUser={matchData.imageCurrentUser}
                imageOpponent={matchData.imageOpponent}
              />
              <StatusComponent
                matchWon={matchData.matchWon}
                score={matchData.score}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

function MatchHistory({ nickname }: { nickname: string }) {
  const matchData = useUserMatchHistory(nickname);

  useEffect(() => {
    void matchData.refetch();
  }, [nickname]);

  return (
    <>
      {matchData.isLoading && <p>isLoading...</p>}
      {matchData.isSuccess && (
        <CenterBox>
          <div className="h-full overflow-y-auto">
            <div className="flex">
              <div className="flex-1">
                <h2 className="flex justify-center p-5 font-bold">
                  MATCH HISTORY
                </h2>
                <MatchHistoryComponent matchData={matchData.data} />
              </div>
            </div>
          </div>
        </CenterBox>
      )}
    </>
  );
}

export default MatchHistory;
