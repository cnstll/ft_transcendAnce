import { useEffect, useRef, useState, MouseEvent } from "react"
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

let player = 1;
let paddleHeight = 50;

enum GameStatus {
  PLAYING = 'PLAYING',
  DONE = "DONE",
  PENDING = "PENDING"
}
interface GameCoords {
  gameRoom: string;
  dirx: number;
  diry: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  bx: number;
  by: number;
  p1s: number;
  p2s: number;
  paddleSize: number;
}

function Game() {

  // const [gameId, setGameId] = useState<string>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PENDING);
  const [gameId, setGameId] = useState<null | string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gameId: string | null = "";
    if (localStorage.getItem('gameId') != null && localStorage.getItem('gameId') != "") {
      setGameId(localStorage.getItem('gameId'));
      return;
      // gameId = localStorage.getItem('gameId');
      // setGameId(gameId);
    }

    socket.emit('join', { name: gameId }, (response: { gameId: string, pNumber: number }) => {
      if (response.pNumber > 1) {
        player = 2;
      }
      localStorage.setItem('gameId', response.gameId);
      setGameId(gameId);
    });

  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (localStorage.getItem('gameId') != null && localStorage.getItem('gameId') != "") {
      // gameId = localStorage.getItem('gameId');
      setGameId(localStorage.getItem('gameId'));
    }
    const joinListener = (text: { gameId: string, status: string, winner: string }) => {
      setGameId(gameId)
      if (text.status == 'PENDING') {
        setGameStatus(GameStatus.PENDING);
      }
      else if (text.status == 'DONE') {
        setGameStatus(GameStatus.DONE);
        localStorage.clear();
        navigate('/');
      }
      else if (text.status == 'PLAYING') {
        setGameStatus(GameStatus.PLAYING);
      }
    }

    socket.on('gameStatus', joinListener);

    if (canvas != null) {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight / 2}px`;
      paddleHeight = canvas.height / 20;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context != null) {
        context.scale(2, 2);
        context.lineCap = "round"
        context.strokeStyle = "white"
        context.fillStyle = "white"
        contextRef.current = context;

        const messageListener = (text: GameCoords) => {
          context.fillStyle = "black"
          context.fillRect(0, 0, (canvas.width / 2), canvas.height)
          context.fillStyle = "white"
          let posy = (canvas.height / 2) * (text.p1y / 100);
          let posx = (canvas.width / 2) * (text.p1x / 100);

          context.fillRect(posx, posy, 10, paddleHeight);
          posy = (canvas.height / 2) * (text.p2y / 100);
          posx = (canvas.width / 2) * (text.p2x / 100);
          context.fillRect(posx, posy, 10, paddleHeight);
          context.font = "30px Arial";

          if (player == 1) {
            context.font = "30px Arial";
            context.fillStyle = "green"
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            context.font = "30px Arial";
            context.fillStyle = "red"
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          } else {
            context.font = "30px Arial";
            context.fillStyle = "red"
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            context.font = "30px Arial";
            context.fillStyle = "green"
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          }
          context.fillStyle = "yellow"
          posy = (canvas.height / 2) * (text.by / 100);
          posx = (canvas.width / 2) * (text.bx / 100);
          context.fillRect(posx, posy, 10, 10);
        };


        socket.on('message', messageListener);

        return () => {
          socket.off('message', messageListener);
        };
      }
    }
    return;
  }, [window.innerWidth, window.innerHeight, gameStatus, gameId])


  function movePaddle(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY;
    if (gameStatus == GameStatus.PLAYING && canvasRef.current != null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const posy = ((clientY - rect.top) / (canvasRef.current.height / 2)) * 100;
      socket.emit('createMessage', { x: 50, y: posy, room: gameId, player: player }, (res: GameCoords) => {
        void (res);
      });
      //TODO remove x 
    }
  }

  return (
    <>
      {/* {isReady == false && <p> Waiting for a dance partner </p>} */}
      {/* {isReady  && < canvas onMouseMove={movePaddle} ref={canvasRef} />} */}
      {/* {isReady == true && < canvas onMouseMove={movePaddle} ref={canvasRef} />} */}
      {/* {< canvas onMouseMove={movePaddle} ref={canvasRef} />} */}
      {gameStatus == GameStatus.PLAYING && < canvas onMouseMove={movePaddle} ref={canvasRef} />}
      {gameStatus == GameStatus.DONE && <p> done, you probably lost  </p>}
      {gameStatus == GameStatus.PENDING && <p> Waiting for a dance partner  {gameStatus}</p>}
      {/* {<button onClick={clickHandle}> thisis </button>} */}
    </>
  )
}

export default Game;
