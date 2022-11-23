import React from 'react';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpponentInfo } from 'src/components/query-hooks/useTargetInfo';
import { socket } from '../../global-components/client-socket';
import { GameCoords, GameStatus } from '../../global-components/interface';
import { GameInfo, PlayerInfo } from '../../../proto/file_pb';
import { draw } from 'src/components/custom-hooks/draw';


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

interface GameInformation {
  p1x: number,
  p2x: number,
  gameCoordinates: GameCoords,
  ballWidth: number,
  heightScalar: number,
  widthScalar: number,
  paddleWidth: number,
  paddleHeight: number,
  canvas: HTMLCanvasElement | null,
  context: CanvasRenderingContext2D | null, 
  cacheCanvas: OffscreenCanvas | null,
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
  gameCoordinates: gameCoordinates,
  ballWidth: 10,
  heightScalar: 0,
  widthScalar: 0,
  paddleWidth: 0,
  paddleHeight: 0,
  canvas: null,
  context: null,
  cacheCanvas: null,
};

function Game({ gameMode, avatarImg, userId }: GameProps) {

  const message = new PlayerInfo();
  let encodedMessage;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const navigate = useNavigate();
  // let cacheCanvas: OffscreenCanvas;
  const [playerOneScore, setPlayerOneScore] = useState<number | undefined>(
    undefined,
  );
  const [playerNumber, setPlayerNumber] = useState<number | undefined>(
    undefined,
  );
  const [playerOneId, setPlayerOneId] = useState<string | undefined>(undefined);
  const [playerTwoId, setPlayerTwoId] = useState<string | undefined>(undefined);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);

  useEffect(() => {
    socket.emit(
      'joinGame',
      { mode: gameMode },
      (response: { playerNumber: number }) => {
        setPlayerNumber(response.playerNumber);
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
        setPlayerOneScore(text.player1score);
        setGameStatus(GameStatus.OVER);
      } else if (text.status === 'PLAYING') {
        setGameStatus(GameStatus.PLAYING);
        setPlayerOneId(text.player1id);
        setPlayerTwoId(text.player2id);
      } else if (text.status === 'PAUSED') {
        setGameStatus(GameStatus.PAUSED);
      }
    };

    socket.on('gameStatus', joinListener);

      gameInfo.canvas.width = window.innerWidth;
      gameInfo.canvas.height = window.innerHeight / 2;
      gameInfo.canvas.style.width = `${window.innerWidth}px`;
      gameInfo.canvas.style.height = `${window.innerHeight / 2}px`;

      gameInfo.cacheCanvas = new OffscreenCanvas(gameInfo.canvas.width, gameInfo.canvas.height);
      // this canvas is used for static elements so as to not have to repeat these operations every frame
      const cacheContext = gameInfo.cacheCanvas.getContext('2d');
      if (cacheContext) {
        cacheContext.fillStyle = 'black';
        cacheContext.fillRect(0, 0, gameInfo.canvas.width, gameInfo.canvas.height);
        cacheContext.strokeStyle = 'white';
        cacheContext.setLineDash([10, 10]);
        cacheContext.moveTo(gameInfo.canvas.width / 2, 0);
        cacheContext.lineTo(gameInfo.canvas.width / 2, gameInfo.canvas.height);
        cacheContext.stroke();
      }

 gameInfo.heightScalar =
        window.innerHeight / (2 * gameConstants.relativeGameHeight);

      gameInfo.widthScalar = window.innerWidth / gameConstants.relativeGameWidth;
      gameInfo.paddleWidth = gameInfo.widthScalar * gameConstants.paddleWidth;
      gameInfo.p1x = gameInfo.widthScalar * gameConstants.player1PaddlePosX - gameInfo.paddleWidth;
      gameInfo.p2x = gameInfo.widthScalar * gameConstants.player2PaddlePosX;
      gameInfo.ballWidth = gameInfo.widthScalar * gameConstants.ballHeight;
      gameInfo.paddleHeight = gameInfo.heightScalar * gameConstants.paddleHeight;

      gameInfo.context = gameInfo.canvas.getContext('2d');
      if (gameInfo.context !== null) {
        // this size is used to have a relative font size
        const size = 0.03 * window.innerWidth;
        gameInfo.context.textBaseline = 'middle';
        //Center Horizontally
        gameInfo.context.textAlign = 'center';
        contextRef.current = gameInfo.context;
        gameInfo.context.drawImage(gameInfo.cacheCanvas, 0, 0);
        gameInfo.context.setLineDash([10, 10]);
        gameInfo.context.moveTo(gameInfo.canvas.width / 2, 0);
        gameInfo.context.lineTo(gameInfo.canvas.width / 2, gameInfo.canvas.height);
        gameInfo.context.fillStyle = 'black';
        gameInfo.context.fillRect(0, 0, gameInfo.canvas.width / 2, gameInfo.canvas.height);

        switch (gameStatus) {
          case GameStatus.PENDING:
            gameInfo.context.font = size.toString() + 'px Aldrich';
            gameInfo.context.fillStyle = 'green';
            gameInfo.context.fillText(
              'Waiting for a partner...',
              gameInfo.canvas.width / 2,
              gameInfo.canvas.height / 2,
            );
            break;

          case GameStatus.PAUSED:
            gameInfo.context.font = size.toString() + 'px Aldrich';
            gameInfo.context.fillStyle = 'green';
            gameInfo.context.fillText(
              'Opponent disconnected',
              window.innerWidth / 2,
              gameInfo.canvas.height / 2 - gameInfo.canvas.height / 8,
            );
            gameInfo.context.fillText(
              'You will win by default in 10s',
              window.innerWidth / 2,
              gameInfo.canvas.height / 2 + gameInfo.canvas.height / 8,
            );
            break;

          case GameStatus.OVER:
            gameInfo.context.font = size.toString() + 'px Aldrich';
            if (
              (playerOneScore === 10 && playerNumber === 1) ||
              (playerOneScore !== 10 && playerNumber === 2)
            ) {
              contextRef.current.fillStyle = 'green';
              contextRef.current.fillText(
                'Congratulations, you won!',
                gameInfo.canvas.width / 2,
                gameInfo.canvas.height / 2,
              );
            } else {
              contextRef.current.fillStyle = 'red';
              contextRef.current.fillText(
                'Sorry, you lost!',
                gameInfo.canvas.width / 2,
                gameInfo.canvas.height / 2,
              );
            }
            break;
        }

        const messageListener = (encoded: Uint8Array) => {
          try {
            gameInfo.gameCoordinates = GameInfo.deserializeBinary(encoded).toObject();
            window.requestAnimationFrame(function() {
              draw(gameInfo);
            });
          } catch (e) {
            console.log(e);
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

  function movePaddle(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY;

    if (contextRef.current !== null && canvasRef.current !== null) {
      contextRef.current.textBaseline = 'middle';
      contextRef.current.textAlign = 'center';
      // const size = 0.03 * canvasRef.current.width;
      const rect = canvasRef.current.getBoundingClientRect();
      const posy: number = Math.round(
        ((clientY - rect.top) / canvasRef.current.height) *
          gameConstants.relativeGameWidth,
      );

      switch (gameStatus) {
        case GameStatus.PLAYING:
          message.setYpos(posy);
          encodedMessage = message.serializeBinary();
          socket.volatile.emit('PP', encodedMessage.buffer);
          break;

        // case GameStatus.PENDING:
        //   contextRef.current.fillStyle = 'black';
        //   contextRef.current.fillRect(
        //     0,
        //     0,
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height,
        //   );
        //   contextRef.current.font = size.toString() + 'px Aldrich';
        //   contextRef.current.fillStyle = 'green';
        //   contextRef.current.fillText(
        //     'Waiting for a partner...',
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height / 2,
        //   );
        //   contextRef.current.fillStyle = 'white';
        //   contextRef.current.fillRect(
        //     50,
        //     clientY - rect.top - gameInfo.paddleHeight / 2,
        //     10,
        //     gameInfo.paddleHeight,
        //   );
        //   break;

        // case GameStatus.PAUSED:
        //   contextRef.current.fillStyle = 'black';
        //   contextRef.current.fillRect(
        //     0,
        //     0,
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height,
        //   );
        //   contextRef.current.font = size.toString() + 'px Aldrich';
        //   contextRef.current.fillStyle = 'green';
        //   contextRef.current.fillText(
        //     'Opponent disconnected',
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height / 2 - canvasRef.current.height / 8,
        //   );
        //   contextRef.current.fillText(
        //     'You will win by default in 10s',
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height / 2 + canvasRef.current.height / 8,
        //   );
        //   contextRef.current.fillStyle = 'white';
        //   contextRef.current.fillRect(
        //     50,
        //     clientY - rect.top - gameInfo.paddleHeight / 2,
        //     10,
        //     gameInfo.paddleHeight,
        //   );
        //   break;

        // case GameStatus.OVER:
        //   contextRef.current.fillStyle = 'black';
        //   contextRef.current.fillRect(
        //     0,
        //     0,
        //     canvasRef.current.width / 2,
        //     canvasRef.current.height,
        //   );
        //   contextRef.current.font = size.toString() + 'px Aldrich';
        //   console.log(playerOneScore);
        //   console.log(playerNumber);
        //   if (
        //     (playerOneScore === 10 && playerNumber === 1) ||
        //     (playerOneScore !== 10 && playerNumber === 2)
        //   ) {
        //     contextRef.current.fillStyle = 'green';
        //     contextRef.current.fillText(
        //       'Congratulations, you won!',
        //       canvasRef.current.width / 2,
        //       canvasRef.current.height / 2,
        //     );
        //   } else {
        //     contextRef.current.fillStyle = 'red';
        //     contextRef.current.fillText(
        //       'Sorry, you lost!',
        //       canvasRef.current.width / 2,
        //       canvasRef.current.height / 2,
        //     );
        //   }
        //   break;
      }
    }
  }

  let opponentId: string | undefined = userId;
  if (playerNumber === 1 && playerTwoId) opponentId = playerTwoId;
  else if (playerNumber === 2 && playerOneId) opponentId = playerOneId;

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
          playerNumber !== undefined && (
            <PlayerAvatar
              currentPlayerAvatar={avatarImg}
              opponentAvatar={opponent.data.avatarImg}
              playerNumber={playerNumber}
            />
          )}
      </div>
    </div>
  );
}

export default React.memo(Game);
