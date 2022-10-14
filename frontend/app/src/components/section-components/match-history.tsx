interface MatchData {
  id?: string;
  imageCurrentPlayer: string;
  imageOponent: string;
  score: string;
  matchWon: boolean;
}

interface PictureData {
  imageCurrentPlayer: string;
  imageOponent: string;
}

interface StatusData {
  score: string;
  matchWon: boolean;
}

const matchExamples: MatchData[] = [
  {
    id: '123e4567e89b1',
    imageCurrentPlayer:
      'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
    imageOponent:
      'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    score: '7-10',
    matchWon: false,
  },
  {
    id: '123e4567e89b2',
    imageCurrentPlayer:
      'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
    imageOponent:
      'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    score: '10-3',
    matchWon: true,
  },
  {
    id: '123e4567e89b3',
    imageCurrentPlayer:
      'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
    imageOponent:
      'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    score: '10-1',
    matchWon: true,
  },
  {
    id: '123e4567e89b4',
    imageCurrentPlayer:
      'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
    imageOponent:
      'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    score: '10-9',
    matchWon: true,
  },
];

function VersusComponent({ imageCurrentPlayer, imageOponent }: PictureData) {
  return (
    <div className="flex flex-row gap-2">
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={imageCurrentPlayer}
        alt="Rounded avatar"
      />
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">/</p>
      <img
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
        src={imageOponent}
        alt="Rounded avatar"
      />
    </div>
  );
}

function StatusComponent({ matchWon, score}: StatusData) {
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

function MatchHistory() {
  return (
    <div className="flex flex-col gap-6 m-10">
      {matchExamples.map((matchExample) => (
        <div
          key={matchExample.id}
          className="flex flex-row gap-32 items-center"
        >
          <VersusComponent
            imageCurrentPlayer={matchExample.imageCurrentPlayer}
            imageOponent={matchExample.imageOponent}
          />
          <StatusComponent
            matchWon={matchExample.matchWon}
            score={matchExample.score}
          />
        </div>
      ))}
    </div>
  );
}

export default MatchHistory;
