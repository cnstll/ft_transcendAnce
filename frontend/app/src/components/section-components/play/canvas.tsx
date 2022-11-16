import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpponentInfo } from 'src/components/query-hooks/useTargetInfo';
import { socket } from '../../global-components/client-socket';
import { GameCoords, GameStatus } from '../../global-components/interface';

let paddleHeight = 50;

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

function Game({ gameMode, avatarImg, userId }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const navigate = useNavigate();
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
    const canvas = canvasRef.current;
    const joinListener = (text: {
      gameId: string;
      status: string;
      winner: string;
      player1id: string;
      player2id: string;
    }) => {
      if (text.status === 'PENDING') {
        setGameStatus(GameStatus.PENDING);
      } else if (text.status === 'DONE') {
        setGameStatus(GameStatus.DONE);
        navigate('/profile');
      } else if (text.status === 'OVER') {
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
    if (canvas !== null) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight / 2 + 5}px`;
      paddleHeight = canvas.height / 20;
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
      if (context !== null) {
        const size = 0.03 * window.innerWidth;
        context.textBaseline = 'middle';
        //Center Horizontally
        context.textAlign = 'center';
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.fillStyle = 'white';
        contextRef.current = context;
        context.setLineDash([10, 10]);
        context.moveTo(canvas.width / 4, 0);
        context.lineTo(canvas.width / 4, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width / 2, canvas.height);

        switch (gameStatus) {
          case GameStatus.PENDING:
            context.font = size.toString() + 'px Aldrich';
            context.fillStyle = 'green';
            context.fillText(
              'Waiting for a partner...',
              canvas.width / 4,
              canvas.height / 4,
            );
            break;

          case GameStatus.PAUSED:
            context.font = size.toString() + 'px Aldrich';
            context.fillStyle = 'green';
            context.fillText(
              'Opponent disconnected',
              window.innerWidth / 4,
              canvas.height / 4 - canvas.height / 8,
            );
            context.fillText(
              'You will win by default in 10s',
              window.innerWidth / 4,
              canvas.height / 4 + canvas.height / 8,
            );
            break;

          case GameStatus.OVER:
            context.font = size.toString() + 'px Aldrich';
            if (
              (playerOneScore === 10 && playerNumber === 1) ||
              (playerOneScore !== 10 && playerNumber === 2)
            ) {
              contextRef.current.fillStyle = 'green';
              contextRef.current.fillText(
                'Congratulations, you won!',
                canvas.width / 4,
                canvas.height / 4,
              );
            } else {
              contextRef.current.fillStyle = 'red';
              contextRef.current.fillText(
                'Sorry, you lost!',
                canvas.width / 4,
                canvas.height / 4,
              );
            }
            break;
        }

        const messageListener = (text: GameCoords) => {
          context.fillStyle = text.color;
          context.fillRect(0, 0, canvas.width / 2, canvas.height);
          context.fillStyle = 'white';
          context.stroke();
          let posy = (canvas.height / 2) * (text.p1y / 100);
          let posx = (canvas.width / 2) * (text.p1x / 100);

          // drawing the paddle
          context.fillRect(posx, posy - paddleHeight / 2, 10, paddleHeight);
          posy = (canvas.height / 2) * (text.p2y / 100);
          posx = (canvas.width / 2) * (text.p2x / 100);
          context.fillRect(posx, posy - paddleHeight / 2, 10, paddleHeight);
          context.font = '30px Aldrich';
          setPlayerOneScore(text.p1s);
          if (text.p1s < 10) {
            context.font = '30px Aldrich';
            context.fillStyle = 'white';
            context.fillText(
              '0' + text.p1s.toString(),
              canvas.width / 4 - 100,
              50,
            );
          }
          if (text.p2s < 10) {
            context.font = '30px Aldrich';
            context.fillStyle = 'white';
            context.fillText(
              '0' + text.p2s.toString(),
              canvas.width / 4 + 100,
              50,
            );
          }
          if (text.p1s === 10) {
            context.font = '30px Aldrich';
            context.fillStyle = 'white';
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
          }
          if (text.p2s === 10) {
            context.font = '30px Aldrich';
            context.fillStyle = 'white';
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          }
          context.fillStyle = 'yellow';
          posy = (canvas.height / 2) * (text.by / 100);
          posx = (canvas.width / 2) * (text.bx / 100);
          context.fillRect(posx - 5, posy, 10, 10);
        };

        socket.on('updatedGameInfo', messageListener);

        return () => {
          socket.off('updatedGameInfo', messageListener);
        };
      }
    }
    return;
  }, [window.innerWidth, window.innerHeight, gameStatus, window]);

  function movePaddle(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY;

    if (contextRef.current !== null && canvasRef.current !== null) {
      //Center vertically
      contextRef.current.textBaseline = 'middle';
      //Center Horizontally
      contextRef.current.textAlign = 'center';
      const size = 0.03 * canvasRef.current.width;
      const rect = canvasRef.current.getBoundingClientRect();
      const posy =
        ((clientY - rect.top) / (canvasRef.current.height / 2)) * 100;
      switch (gameStatus) {
        case GameStatus.PLAYING:
          socket.emit('updatePaddlePos', { yPos: posy }, (res: GameCoords) => {
            void res;
          });
          break;

        case GameStatus.PENDING:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(
            0,
            0,
            canvasRef.current.width / 2,
            canvasRef.current.height,
          );
          contextRef.current.font = size.toString() + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText(
            'Waiting for a partner...',
            canvasRef.current.width / 4,
            canvasRef.current.height / 4,
          );
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(
            50,
            clientY - rect.top - paddleHeight / 2,
            10,
            paddleHeight,
          );
          break;

        case GameStatus.PAUSED:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(
            0,
            0,
            canvasRef.current.width / 2,
            canvasRef.current.height,
          );
          contextRef.current.font = size.toString() + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText(
            'Opponent disconnected',
            canvasRef.current.width / 4,
            canvasRef.current.height / 4 - canvasRef.current.height / 8,
          );
          contextRef.current.fillText(
            'You will win by default in 10s',
            canvasRef.current.width / 4,
            canvasRef.current.height / 4 + canvasRef.current.height / 8,
          );
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(
            50,
            clientY - rect.top - paddleHeight / 2,
            10,
            paddleHeight,
          );
          break;

        case GameStatus.OVER:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(
            0,
            0,
            canvasRef.current.width / 2,
            canvasRef.current.height,
          );
          contextRef.current.font = size.toString() + 'px Aldrich';
          if (
            (playerOneScore === 10 && playerNumber === 1) ||
            (playerOneScore !== 10 && playerNumber === 2)
          ) {
            contextRef.current.fillStyle = 'green';
            contextRef.current.fillText(
              'Congratulations, you won!',
              canvasRef.current.width / 4,
              canvasRef.current.height / 4,
            );
          } else {
            contextRef.current.fillStyle = 'red';
            contextRef.current.fillText(
              'Sorry, you lost!',
              canvasRef.current.width / 4,
              canvasRef.current.height / 4,
            );
          }
          break;
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

export default Game;
