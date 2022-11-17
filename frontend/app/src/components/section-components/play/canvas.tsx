import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../global-components/client-socket';
import { GameCoords, GameStatus } from '../../global-components/interface';
import {GameInfo} from '../../../proto/file_pb'

let paddleHeight = 50;

function Game({ gameMode }: { gameMode: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);
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

  useEffect(() => {
    socket.emit(
      'joinGame',
      { mode: gameMode },
      // if we want to do conditional elements based on player number we will need this
      // (response: { playerNumber: number }) => {
      //   player = response.playerNumber;
      // },
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
      playerOneId: string,
      playerTwoId: string,
    }) => {
      if (text.status === 'PENDING') {
        setGameStatus(GameStatus.PENDING);
      } else if (text.status === 'DONE') {
        setGameStatus(GameStatus.DONE);
        navigate('/profile');
      } else if (text.status === 'PLAYING') {
        setGameStatus(GameStatus.PLAYING);
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
        if (gameStatus === GameStatus.PENDING) {
          context.fillStyle = 'black';
          context.fillRect(0, 0, canvas.width , canvas.height);
          context.font = (size.toString()) + 'px Aldrich';
          context.fillStyle = 'green';
          context.fillText('waiting for a partner...',canvas.width / 2 , canvas.height/ 2);
        }
        else if (gameStatus === GameStatus.PAUSED) {
          context.fillStyle = 'black';
          context.fillRect(0, 0, canvas.width , canvas.height);
          context.font = (size.toString()) + 'px Aldrich';
          context.fillStyle = 'green';
          context.fillText('Opponent disconnected',window.innerWidth / 2 , canvas.height/ 2 - canvas.height/ 4);
          context.fillText('you will win by default in 10s',window.innerWidth / 2, canvas.height/ 2 + canvas.height / 4);
        }

        const messageListener = (encoded: Uint8Array) => {
          const gameCoordinates =  GameInfo.deserializeBinary(encoded).toObject();
          window.requestAnimationFrame(draw);
          function draw() {
            if (contextRef.current && canvasRef.current) {
              contextRef.current.drawImage(cacheCanvas, 0,0);

              // drawing the paddles
              contextRef.current.fillStyle = 'white';
              contextRef.current.fillRect(p1x, heightScalar * gameCoordinates.p1y - (paddleHeight / 2 ), paddleWidth, paddleHeight);
              contextRef.current.fillRect(p2x, heightScalar * gameCoordinates.p2y - (paddleHeight/2), paddleWidth, paddleHeight);

              // Writing scores
              contextRef.current.font = '30px Aldrich';
              contextRef.current.fillText(gameCoordinates.p1s.toString(), window.innerWidth / 2 - 100, 50);
              contextRef.current.fillText(gameCoordinates.p2s.toString(), window.innerWidth / 2 + 100, 50);

              //drawing the ball
              contextRef.current.fillStyle = 'yellow';
              contextRef.current.fillRect(widthScalar * (gameCoordinates.bx - ballWidth / 2) , heightScalar * gameCoordinates.by, ballWidth, ballWidth);
            }
          }
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
          socket.emit(
            'updatePaddlePos',
            { yPos: posy },
            (res: GameCoords) => {
              void res;
            },
          );
          break;

        case GameStatus.PENDING:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(0, 0, canvasRef.current.width , canvasRef.current.height);
          contextRef.current.font = (size.toString()) + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText('waiting for a partner...',canvasRef.current.width / 2 , canvasRef.current.height/ 2);
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(50, clientY -rect.top - (paddleHeight / 2 ), paddleWidth, paddleHeight);
          break;

        case GameStatus.PAUSED:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(0, 0, canvasRef.current.width , canvasRef.current.height);
          contextRef.current.font = (size.toString()) + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText('Opponent disconnected',canvasRef.current.width / 2, canvasRef.current.height/ 2 - canvasRef.current.height / 4);
          contextRef.current.fillText('you will win by default in 10s',canvasRef.current.width / 2, canvasRef.current.height/ 2 + canvasRef.current.height / 4);
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(50, (clientY -rect.top)  - (paddleHeight / 2 ), paddleWidth, paddleHeight);
          break;
      }
    }
  }



  return (
    <>
      {gameStatus === GameStatus.PLAYING && (
        <canvas onMouseMove={movePaddle} ref={canvasRef} 
          className='border-solid border-2 border-white'
          />
      )}
      {gameStatus === GameStatus.DONE && <p> done, you probably lost </p>}
      {gameStatus === GameStatus.PENDING && (
        <canvas onMouseMove={movePaddle} ref={canvasRef} 
          className='border-solid border-2 border-white'
          />
      )}
      {gameStatus === GameStatus.PAUSED && (
        <canvas onMouseMove={movePaddle} ref={canvasRef} 
          className='border-solid border-2 border-white'
          />
      )}
      </>
  );
}

export default Game;
