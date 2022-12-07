import React  from 'react';
import { useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpponentInfo } from 'src/components/query-hooks/useTargetInfo';
import { socket } from '../../global-components/client-socket';
import {
  GameCoords,
  GameInformation,
  GameStatus,
} from '../../global-components/interface';
import { GameInfo, PlayerInfo } from '../../../proto/file_pb';
import { cacheCanvas, draw } from 'src/components/custom-hooks/draw';
import { drawGameStatus } from 'src/components/custom-hooks/game-statuses';

const gameConstants = {
  relativeGameWidth: 1000,
  relativeMiddle: 500,
  relativeGameHeight: 1000,
  player1PaddlePosX: 80,
  player2PaddlePosX: 920,
  paddleWidth: 10,
  paddleHeight: 100,
  ballHeight: 10,
};

interface GameProps {
  gameMode: string;
  avatarImg: string;
  userId: string;
}

interface PlayerAvatarProps {
  currentPlayerAvatar: string;
  opponentAvatar: string;
  playerNumber: number;
}

function PlayerAvatar({
  currentPlayerAvatar,
  opponentAvatar,
  playerNumber,
}: PlayerAvatarProps) {
  return (
    <>
      {playerNumber === 1 ? (
        <div className="flex flex-row justify-between mt-4">
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src={currentPlayerAvatar}
          />
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src={opponentAvatar}
          />
        </div>
      ) : (
        <div className="flex flex-row justify-between mt-4">
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src={opponentAvatar}
          />
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src={currentPlayerAvatar}
          />
        </div>
      )}
    </>
  );
}

const gameCoordinates: GameCoords = {
  p1y: 0,
  p2y: 0,
  bx: 0,
  by: 0,
  p1s: 0,
  p2s: 0,
};

const gameInfo: GameInformation = {
  p1x: 0,
  p2x: 0,
  playerOneScore: 0,
  playerTwoScore: 0,
  gameCoordinates: gameCoordinates,
  ballWidth: 10,
  heightScalar: 0,
  widthScalar: 0,
  paddleWidth: 0,
  paddleHeight: 0,
  canvas: null,
  context: null,
  cacheCanvas: null,
  fontSize: 0,
  playerNumber: 1,
};

function Game({ gameMode, avatarImg, userId }: GameProps) {
  const message = new PlayerInfo();
  let encodedMessage;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [playerOneId, setPlayerOneId] = useState<string | undefined>(undefined);
  const [playerTwoId, setPlayerTwoId] = useState<string | undefined>(undefined);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);

  useEffect(() => {
    socket.emit(
      'joinGame',
      { mode: gameMode },
      (response: { playerNumber: number }) => {
        gameInfo.playerNumber = response.playerNumber;
      },
    );
    return () => {
      socket.emit('leaveGame', {});
    };
  }, []);

  useEffect(() => {
    gameInfo.canvas = canvasRef.current;
    if (gameInfo.canvas !== null) {
      const joinListener = (text: {
        gameId: string;
        status: string;
        winner: string;
        player1id: string;
        player2id: string;
        player1score: number;
      }) => {
        if (text.status === 'PENDING') {
          setGameStatus(GameStatus.PENDING);
        } else if (text.status === 'DONE') {
          setGameStatus(GameStatus.DONE);
          navigate('/profile');
        } else if (text.status === 'OVER') {
          gameInfo.playerOneScore = text.player1score;
          setGameStatus(GameStatus.OVER);
          drawGameStatus(gameInfo, gameStatus);
        } else if (text.status === 'PLAYING') {
          setGameStatus(GameStatus.PLAYING);
          setPlayerOneId(text.player1id);
          setPlayerTwoId(text.player2id);
        } else if (text.status === 'PAUSED') {
          setGameStatus(GameStatus.PAUSED);
          drawGameStatus(gameInfo, gameStatus);
        }
      };

      socket.on('gameStatus', joinListener);

      // Setting the numbers needed to scale the game based on window size
      gameInfo.heightScalar =
        window.innerHeight / (2 * gameConstants.relativeGameHeight);
      gameInfo.widthScalar =
        window.innerWidth / gameConstants.relativeGameWidth;
      gameInfo.paddleWidth = gameInfo.widthScalar * gameConstants.paddleWidth;
      gameInfo.p1x =
        gameInfo.widthScalar * gameConstants.player1PaddlePosX -
        gameInfo.paddleWidth;
      gameInfo.p2x = gameInfo.widthScalar * gameConstants.player2PaddlePosX;
      gameInfo.ballWidth = gameInfo.widthScalar * gameConstants.ballHeight;
      gameInfo.paddleHeight =
        gameInfo.heightScalar * gameConstants.paddleHeight;

      gameInfo.context = gameInfo.canvas.getContext('2d');

      if (gameInfo.context !== null) {
        gameInfo.canvas.width = window.innerWidth;
        gameInfo.canvas.height = window.innerHeight / 2;
        gameInfo.canvas.style.width = `${window.innerWidth}px`;
        gameInfo.canvas.style.height = `${window.innerHeight / 2}px`;

        gameInfo.cacheCanvas = cacheCanvas(gameInfo);

        // this size is used to have a relative font size
        // const size = 0.03 * window.innerWidth;
        gameInfo.fontSize = 0.03 * window.innerWidth;
        gameInfo.context.drawImage(gameInfo.cacheCanvas, 0, 0);

        drawGameStatus(gameInfo, gameStatus);

        const messageListener = (encoded: Uint8Array) => {
          try {
            gameInfo.gameCoordinates =
              GameInfo.deserializeBinary(encoded).toObject();
            window.requestAnimationFrame(function () {
              draw(gameInfo);
            });
          } catch (e) {
            void(e);
          }
        };

        socket.on('GI', messageListener);

        return () => {
          socket.off('GI', messageListener);
          socket.off('gameStatus', joinListener);
        };
      }
    }
    return;
  }, [window.innerWidth, window.innerHeight, gameStatus]);

  function movePaddle(event: React.MouseEvent<HTMLCanvasElement>) {
    event.preventDefault();
    const clientY = event.clientY;

    if (
      gameInfo.context !== null &&
      canvasRef.current !== null &&
      gameStatus === GameStatus.PLAYING
    ) {
      gameInfo.context.textBaseline = 'middle';
      gameInfo.context.textAlign = 'center';
      const rect = canvasRef.current.getBoundingClientRect();
      const posy: number = Math.round(
        ((clientY - rect.top) / canvasRef.current.height) *
          gameConstants.relativeGameWidth,
      );
      message.setYpos(posy);
      encodedMessage = message.serializeBinary();
      socket.volatile.emit('PP', encodedMessage.buffer);
    }
  }

  let opponentId: string | undefined = userId;
  if (gameInfo.playerNumber === 1 && playerTwoId) opponentId = playerTwoId;
  else if (gameInfo.playerNumber === 2 && playerOneId) opponentId = playerOneId;

  const opponent = useOpponentInfo(opponentId);

  return (
    <div className="fixed top-1/4">
      <div>
        {gameStatus === GameStatus.PLAYING && (
          <canvas
            onMouseMove={movePaddle}
            ref={canvasRef}
            className="border-solid border-2 border-white"
          />
        )}
        {gameStatus === GameStatus.DONE && (
          <p className="text-white"> The game is over, you probably lost </p>
        )}
        {gameStatus === GameStatus.OVER && (
          <canvas
            onMouseMove={movePaddle}
            ref={canvasRef}
            className="border-solid border-2 border-white"
          />
        )}
        {gameStatus === GameStatus.PENDING && (
          <canvas
            onMouseMove={movePaddle}
            ref={canvasRef}
            className="border-solid border-2 border-white"
          />
        )}
        {gameStatus === GameStatus.PAUSED && (
          <canvas
            onMouseMove={movePaddle}
            ref={canvasRef}
            className="border-solid border-2 border-white"
          />
        )}
        {gameStatus === GameStatus.PLAYING &&
          opponent.isSuccess &&
          gameInfo.playerNumber && (
            <PlayerAvatar
              currentPlayerAvatar={avatarImg}
              opponentAvatar={opponent.data.avatarImg}
              playerNumber={gameInfo.playerNumber}
            />
          )}
      </div>
    </div>
  );
}

export default React.memo(Game);
