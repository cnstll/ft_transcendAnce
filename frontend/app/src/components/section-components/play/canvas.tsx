import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';
import { GameCoords, GameStatus } from '../../global-components/interface';

let player = 1;
let paddleHeight = 50;

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);
  const [gameId, setGameId] = useState<null | string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let test: string | null;
    test = '';
    const gameId: string | null = '';
    if (
      sessionStorage.getItem('gameId') != null &&
      sessionStorage.getItem('gameId') != ''
    ) {
      test = sessionStorage.getItem('gameId');
      setGameId(sessionStorage.getItem('gameId'));
    }

    socket.emit(
      'joinGame',
      { name: test, mode: 'CLASSIC' },
      (response: { gameId: string; playerNumber: number }) => {
        if (response.playerNumber > 1) {
          player = 2;
        } else {
          player = 1;
        }
        sessionStorage.setItem('gameId', response.gameId);
        setGameId(gameId);
      },
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      sessionStorage.getItem('gameId') != null &&
      sessionStorage.getItem('gameId') != ''
    ) {
      // gameId = sessionStorage.getItem('gameId');
      setGameId(sessionStorage.getItem('gameId'));
    }
    const joinListener = (text: {
      gameId: string;
      status: string;
      winner: string;
    }) => {
      setGameId(gameId);
      if (text.status === 'PENDING') {
        setGameStatus(GameStatus.PENDING);
      } else if (text.status === 'DONE') {
        setGameStatus(GameStatus.DONE);
        sessionStorage.clear();
        navigate('/');
      } else if (text.status === 'PLAYING') {
        setGameStatus(GameStatus.PLAYING);
      } else if (text.status == 'PAUSED') {
        setGameStatus(GameStatus.PAUSED);
      }
      // console.log('i am here');
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
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.fillStyle = 'white';
        contextRef.current = context;
        context.setLineDash([10, 10]);
        context.moveTo(canvas.width / 4, 0);
        context.lineTo(canvas.width / 4, canvas.height);

        const messageListener = (text: GameCoords) => {
          context.fillStyle = text.color;
          context.fillRect(0, 0, canvas.width / 2, canvas.height);
          context.fillStyle = 'white';
          context.stroke();
          let posy = (canvas.height / 2) * (text.p1y / 100);
          let posx = (canvas.width / 2) * (text.p1x / 100);

          context.fillRect(posx, posy, 10, paddleHeight);
          posy = (canvas.height / 2) * (text.p2y / 100);
          posx = (canvas.width / 2) * (text.p2x / 100);
          context.fillRect(posx, posy, 10, paddleHeight);
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
          context.fillRect(posx, posy, 10, 10);
        };

        socket.on('updatedGameInfo', messageListener);

        return () => {
          socket.off('updatedGameInfo', messageListener);
        };
      }
    }
    return;
  }, [window.innerWidth, window.innerHeight, gameStatus, gameId]);

  function movePaddle(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY;
    if (gameStatus === GameStatus.PLAYING && canvasRef.current !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const posy =
        ((clientY - rect.top) / (canvasRef.current.height / 2)) * 100;
      socket.emit(
        'updatePaddlePos',
        { x: 50, y: posy, room: gameId, player: player },
        (res: GameCoords) => {
          void res;
        },
      );
      //TODO remove x
    }
  }

  return (
    <>
      {gameStatus == GameStatus.PLAYING && (
        <canvas onMouseMove={movePaddle} ref={canvasRef} />
      )}
      {gameStatus == GameStatus.DONE && <p> done, you probably lost </p>}
      {gameStatus == GameStatus.PENDING && (
        <p> Waiting for a dance partner {gameStatus}</p>
      )}
      {gameStatus == GameStatus.PAUSED && (
        <p>
          {' '}
          your partner has disconnected, vixtory will be yours if he doens't
          reconnect withing 5 seconds{' '}
        </p>
      )}
    </>
  );
}

export default Game;
