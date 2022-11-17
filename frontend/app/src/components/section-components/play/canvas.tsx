import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpponentInfo } from 'src/components/query-hooks/useTargetInfo';
import { socket } from '../../global-components/client-socket';
import { GameCoords, GameStatus } from '../../global-components/interface';
import {GameInfo} from '../../../proto/file_pb'

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
  let heightScalar: number;  
  let widthScalar: number ; 
  let p1x: number;
  let p2x: number;
  let ballWidth: number;
  let paddleWidth: number;
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
      canvas.width = window.innerWidth ;
      canvas.height = window.innerHeight / 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight / 2}px`;

      // this canvas is used for static elements so as to not have to repeat these operations every frame
      const cacheCanvas = new OffscreenCanvas(canvas.width, canvas.height); 
      const cacheContext = cacheCanvas.getContext('2d');
      if (cacheContext){
        cacheContext.fillStyle = 'black';
        cacheContext.fillRect(0 , 0,canvas.width, canvas.height);
        cacheContext.strokeStyle = 'white';
        cacheContext.setLineDash([10, 10]);
        cacheContext.moveTo(canvas.width / 2, 0);
        cacheContext.lineTo(canvas.width / 2, canvas.height);
        cacheContext.stroke();
      }

      heightScalar = window.innerHeight / (2 * gameConstants.relativeGameHeight);
      widthScalar = window.innerWidth / (gameConstants.relativeGameWidth);
      paddleWidth = widthScalar * gameConstants.paddleWidth;
      p1x = widthScalar * gameConstants.player1PaddlePosX - paddleWidth;
      p2x = widthScalar * gameConstants.player2PaddlePosX;
      ballWidth = widthScalar * gameConstants.ballHeight;
      paddleHeight = heightScalar * gameConstants.paddleHeight;
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
      if (context !== null) {
        // this size is used to have a relative font size
        const size = 0.03 * window.innerWidth;
        context.textBaseline = 'middle';
        //Center Horizontally
        context.textAlign = 'center';
        contextRef.current = context;
        context.drawImage(cacheCanvas,0,0);
        // <<<<<<< HEAD
        //         if (gameStatus === GameStatus.PENDING) {
        //           context.fillStyle = 'black';
        //           context.fillRect(0, 0, canvas.width , canvas.height);
        //           context.font = (size.toString()) + 'px Aldrich';
        //           context.fillStyle = 'green';
        //           context.fillText('waiting for a partner...',canvas.width / 2 , canvas.height/ 2);
        //         }
        //         else if (gameStatus === GameStatus.PAUSED) {
        //           context.fillStyle = 'black';
        //           context.fillRect(0, 0, canvas.width , canvas.height);
        //           context.font = (size.toString()) + 'px Aldrich';
        //           context.fillStyle = 'green';
        //           context.fillText('Opponent disconnected',window.innerWidth / 2 , canvas.height/ 2 - canvas.height/ 4);
        //           context.fillText('you will win by default in 10s',window.innerWidth / 2, canvas.height/ 2 + canvas.height / 4);
        // =======
        context.setLineDash([10, 10]);
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width / 2, canvas.height);

        switch (gameStatus) {
          case GameStatus.PENDING:
            context.font = size.toString() + 'px Aldrich';
            context.fillStyle = 'green';
            context.fillText(
              'Waiting for a partner...',
              canvas.width / 2,
              canvas.height / 2,
            );
            break;

          case GameStatus.PAUSED:
            context.font = size.toString() + 'px Aldrich';
            context.fillStyle = 'green';
            context.fillText(
              'Opponent disconnected',
              window.innerWidth / 2,
              canvas.height / 2 - canvas.height / 8,
            );
            context.fillText(
              'You will win by default in 10s',
              window.innerWidth / 2,
              canvas.height / 2 + canvas.height / 8,
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
                canvas.width / 2,
                canvas.height / 2,
              );
            } else {
              contextRef.current.fillStyle = 'red';
              contextRef.current.fillText(
                'Sorry, you lost!',
                canvas.width / 2,
                canvas.height / 2,
              );
            }
            break;
          // >>>>>>> 783de642a939cc9fe8d6e8b2484b55a474c69788
        }

        const messageListener = (encoded: Uint8Array) => {
          const gameCoordinates =  GameInfo.deserializeBinary(encoded).toObject();
          window.requestAnimationFrame(draw);
          function draw() {
            if (contextRef.current && canvasRef.current) {
              contextRef.current.drawImage(cacheCanvas, 0,0);

              // <<<<<<< HEAD
              // drawing the paddles
              contextRef.current.fillStyle = 'white';
              contextRef.current.fillRect(p1x, heightScalar * gameCoordinates.p1y - (paddleHeight / 2 ), paddleWidth, paddleHeight);
              contextRef.current.fillRect(p2x, heightScalar * gameCoordinates.p2y - (paddleHeight/2), paddleWidth, paddleHeight);

              // Writing scores
              // contextRef.current.font = '30px Aldrich';
              // contextRef.current.fillText(gameCoordinates.p1s.toString(), window.innerWidth / 2 - 100, 50);
              // contextRef.current.fillText(gameCoordinates.p2s.toString(), window.innerWidth / 2 + 100, 50);

              setPlayerOneScore(gameCoordinates.p1s);
              if (gameCoordinates.p1s < 10) {
                contextRef.current.font = '30px Aldrich';
                contextRef.current.fillStyle = 'white';
                contextRef.current.fillText(
                  '0' + gameCoordinates.p1s.toString(),
                  canvasRef.current.width / 2 - 100,
                  50,
                );
              }
              if (gameCoordinates.p2s < 10) {
                contextRef.current.font = '30px Aldrich';
                contextRef.current.fillStyle = 'white';
                contextRef.current.fillText(
                  '0' + gameCoordinates.p2s.toString(),
                  canvasRef.current.width / 2 + 100,
                  50,
                );
              }
              if (gameCoordinates.p1s === 10) {
                contextRef.current.font = '30px Aldrich';
                contextRef.current.fillStyle = 'white';
                contextRef.current.fillText(gameCoordinates.p1s.toString(), canvasRef.current.width / 2 - 100, 50);
              }
              if (gameCoordinates.p2s === 10) {
                contextRef.current.font = '30px Aldrich';
                contextRef.current.fillStyle = 'white';
                contextRef.current.fillText(gameCoordinates.p2s.toString(), canvasRef.current.width / 2 + 100, 50);
              }
              //drawing the ball
              contextRef.current.fillStyle = 'yellow';
              contextRef.current.fillRect(widthScalar * (gameCoordinates.bx - ballWidth / 2) , heightScalar * gameCoordinates.by, ballWidth, ballWidth);
            }
          }
          // =======
          //           // drawing the paddle
          //           context.fillRect(posx, posy - paddleHeight / 2, 10, paddleHeight);
          //           posy = (canvas.height / 2) * (text.p2y / 100);
          //           posx = (canvas.width / 2) * (text.p2x / 100);
          //           context.fillRect(posx, posy - paddleHeight / 2, 10, paddleHeight);
          //           context.font = '30px Aldrich';
          //           setPlayerOneScore(text.p1s);
          //           if (text.p1s < 10) {
          //             context.font = '30px Aldrich';
          //             context.fillStyle = 'white';
          //             context.fillText(
          //               '0' + text.p1s.toString(),
          //               canvas.width / 4 - 100,
          //               50,
          //             );
          //           }
          //           if (text.p2s < 10) {
          //             context.font = '30px Aldrich';
          //             context.fillStyle = 'white';
          //             context.fillText(
          //               '0' + text.p2s.toString(),
          //               canvas.width / 4 + 100,
          //               50,
          //             );
          //           }
          //           if (text.p1s === 10) {
          //             context.font = '30px Aldrich';
          //             context.fillStyle = 'white';
          //             context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
          //           }
          //           if (text.p2s === 10) {
          //             context.font = '30px Aldrich';
          //             context.fillStyle = 'white';
          //             context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          //           }
          //           context.fillStyle = 'yellow';
          //           posy = (canvas.height / 2) * (text.by / 100);
          //           posx = (canvas.width / 2) * (text.bx / 100);
          //           context.fillRect(posx - 5, posy, 10, 10);
          // >>>>>>> 783de642a939cc9fe8d6e8b2484b55a474c69788
        };

        socket.on('GI', messageListener);

        return () => {
          socket.off('GI', messageListener);
        };
      }
    }
    return;
  }, [window.innerWidth, window.innerHeight, gameStatus, window]);

  function movePaddle(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY ;

    if (contextRef.current !== null && canvasRef.current !== null) {
      //Center vertically
      contextRef.current.textBaseline = 'middle';
      //Center Horizontally
      contextRef.current.textAlign = 'center';
      const size = 0.03 * canvasRef.current.width;
      const rect = canvasRef.current.getBoundingClientRect();
      const posy = ((clientY - rect.top) / (canvasRef.current.height )) * gameConstants.relativeGameWidth;
      switch (gameStatus) {
        case GameStatus.PLAYING:
          socket.emit('updatePaddlePos', { yPos: posy }, (res: GameCoords) => {
            void res;
          });
          break;

        case GameStatus.PENDING:
          contextRef.current.fillStyle = 'black';
          // <<<<<<< HEAD
          //           contextRef.current.fillRect(0, 0, canvasRef.current.width , canvasRef.current.height);
          //           contextRef.current.font = (size.toString()) + 'px Aldrich';
          //           contextRef.current.fillStyle = 'green';
          //           contextRef.current.fillText('waiting for a partner...',canvasRef.current.width / 2 , canvasRef.current.height/ 2);
          //           contextRef.current.fillStyle = 'white';
          //           contextRef.current.fillRect(50, clientY -rect.top - (paddleHeight / 2 ), paddleWidth, paddleHeight);
          // =======
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
            canvasRef.current.width / 2,
            canvasRef.current.height / 2,
          );
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(
            50,
            clientY - rect.top - paddleHeight / 2,
            10,
            paddleHeight,
          );
          // >>>>>>> 783de642a939cc9fe8d6e8b2484b55a474c69788
          break;

        case GameStatus.PAUSED:
          contextRef.current.fillStyle = 'black';
          // <<<<<<< HEAD
          //           contextRef.current.fillRect(0, 0, canvasRef.current.width , canvasRef.current.height);
          //           contextRef.current.font = (size.toString()) + 'px Aldrich';
          //           contextRef.current.fillStyle = 'green';
          //           contextRef.current.fillText('Opponent disconnected',canvasRef.current.width / 2, canvasRef.current.height/ 2 - canvasRef.current.height / 4);
          //           contextRef.current.fillText('you will win by default in 10s',canvasRef.current.width / 2, canvasRef.current.height/ 2 + canvasRef.current.height / 4);
          //           contextRef.current.fillStyle = 'white';
          //           contextRef.current.fillRect(50, (clientY -rect.top)  - (paddleHeight / 2 ), paddleWidth, paddleHeight);
          // =======
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
            canvasRef.current.width / 2,
            canvasRef.current.height / 2 - canvasRef.current.height / 8,
          );
          contextRef.current.fillText(
            'You will win by default in 10s',
            canvasRef.current.width / 2,
            canvasRef.current.height / 2 + canvasRef.current.height / 8,
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
              canvasRef.current.width / 2,
              canvasRef.current.height / 2,
            );
          } else {
            contextRef.current.fillStyle = 'red';
            contextRef.current.fillText(
              'Sorry, you lost!',
              canvasRef.current.width / 2,
              canvasRef.current.height / 2,
            );
          }
          // >>>>>>> 783de642a939cc9fe8d6e8b2484b55a474c69788
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
