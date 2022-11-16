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
  let player: number;

  useEffect(() => {
    socket.emit(
      'joinGame',
      { mode: gameMode },
      (response: { playerNumber: number }) => {
        player = response.playerNumber;
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

        const messageListener = (text: GameCoords) => {
          context.fillStyle = text.color;
          context.fillRect(0, 0, canvas.width / 2, canvas.height);
          context.fillStyle = 'white';
          context.stroke();
          let posy = (canvas.height / 2) * (text.p1y / 100);
          let posx = (canvas.width / 2) * (text.p1x / 100);


          // drawing the paddle
          context.fillRect(posx  , posy - (paddleHeight / 2 ), 10, paddleHeight);
          posy = (canvas.height / 2) * (text.p2y / 100);
          posx = (canvas.width / 2) * (text.p2x / 100);
          context.fillRect(posx, posy - (paddleHeight/2), 10, paddleHeight);
          context.font = '30px Aldrich';

          if (player === 1) {
            context.font = '30px Aldrich';
            context.fillStyle = 'green';
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            context.font = '30px Aldrich';
            context.fillStyle = 'red';
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          } else {
            context.font = '30px Aldrich';
            context.fillStyle = 'red';
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            context.font = '30px Aldrich';
            context.fillStyle = 'green';
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          }
          context.fillStyle = 'yellow';
          posy = (canvas.height / 2) * (text.by / 100);
          posx = (canvas.width / 2) * (text.bx / 100);
          context.fillRect(posx - 5 , posy, 10, 10);
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
      const posy = ((clientY - rect.top) / (canvasRef.current.height / 2)) * 100;
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
          contextRef.current.fillRect(50, clientY -rect.top - (paddleHeight / 2 ), 10, paddleHeight);
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
