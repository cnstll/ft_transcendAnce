import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../global-components/client-socket';
import { GameCoords, GameStatus } from '../../global-components/interface';

let paddleHeight = 50;

function Game({ gameMode }: { gameMode: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);
  const navigate = useNavigate();
  // let player: number;

  useEffect(() => {
    socket.emit(
      'joinGame',
      { mode: gameMode },
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
        if (gameStatus === GameStatus.PENDING) {
          context.font = (size.toString()) + 'px Aldrich';
          context.fillStyle = 'green';
          context.fillText('waiting for a partner...',canvas.width / 4 , canvas.height/ 4);
        }
        else if (gameStatus === GameStatus.PAUSED) {
          context.font = (size.toString()) + 'px Aldrich';
          context.fillStyle = 'green';
          context.fillText('Opponent disconnected',window.innerWidth / 4 , canvas.height/ 4 - canvas.height/8);
          context.fillText('you will win by default in 10s',window.innerWidth / 4, canvas.height/ 4 + canvas.height / 8);
        }

        const paddleWidth = window.innerWidth * 0.003;
        const heightScalar = canvas.height / (2 * 1000);
        const widthScalar = canvas.width / (2 * 1000);
        const p1x = widthScalar * 80 - paddleWidth;
        const p2x = widthScalar * 920;
        const ballWidth = widthScalar * 5;

        const messageListener = (text: GameCoords) => {
          // refreshing the canvas
          context.fillStyle = 'black';
          context.fillRect(0, 0, canvas.width / 2, canvas.height);

          // drawing the net
          context.fillStyle = 'white';
          context.stroke();

          // drawing the paddles
          context.fillRect(p1x, heightScalar * text.p1y - (paddleHeight / 2 ), paddleWidth, paddleHeight);
          context.fillRect(p2x, heightScalar * text.p2y - (paddleHeight/2), paddleWidth, paddleHeight);

          // Writing scores
          context.font = '30px Aldrich';
          context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
          context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);

          //drawing the ball
          context.fillStyle = 'yellow';
          context.fillRect(widthScalar * (text.bx - ballWidth / 2) , heightScalar * text.by, ballWidth, ballWidth);
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
    const clientY = event.clientY ;

    if (contextRef.current !== null && canvasRef.current !== null) {
      //Center vertically
      contextRef.current.textBaseline = 'middle'; 
      //Center Horizontally
      contextRef.current.textAlign = 'center';
      const size = 0.03 * canvasRef.current.width;
      const rect = canvasRef.current.getBoundingClientRect();
      const posy = ((clientY - rect.top) / (canvasRef.current.height / 2)) * 1000;
      switch (gameStatus) {
        case GameStatus.PLAYING:
          socket.emit(
            'updatePaddlePos',
            { yPos: posy / 2 },
            (res: GameCoords) => {
              void res;
            },
          );
          break;

        case GameStatus.PENDING:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(0, 0, canvasRef.current.width / 2, canvasRef.current.height);
          contextRef.current.font = (size.toString()) + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText('waiting for a partner...',canvasRef.current.width / 4 , canvasRef.current.height/ 4);
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(50, clientY -rect.top - (paddleHeight / 2 ), 10, paddleHeight);
          break;

        case GameStatus.PAUSED:
          contextRef.current.fillStyle = 'black';
          contextRef.current.fillRect(0, 0, canvasRef.current.width / 2, canvasRef.current.height);
          contextRef.current.font = (size.toString()) + 'px Aldrich';
          contextRef.current.fillStyle = 'green';
          contextRef.current.fillText('Opponent disconnected',canvasRef.current.width / 4, canvasRef.current.height/ 4 - canvasRef.current.height / 8);
          contextRef.current.fillText('you will win by default in 10s',canvasRef.current.width / 4, canvasRef.current.height/ 4 + canvasRef.current.height / 8);
          contextRef.current.fillStyle = 'white';
          contextRef.current.fillRect(50, (clientY -rect.top) / 2 - (paddleHeight / 2 ), 10, paddleHeight);
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
