import { useEffect, useRef, useState, MouseEvent } from "react"
import { socket } from "./socket";

// let xPos = 50;
let player1 = 1;
let paddleHeight = 50;

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
interface GameProps {
  gameId: undefined | string;
}

function Game(props: GameProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [gameId, setGameId] = useState<null | string>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas != null) {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      paddleHeight = canvas.height / 20;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context != null) {
        context.scale(2, 2);
        context.lineCap = "round"
        context.strokeStyle = "white"
        context.fillStyle = "white"
        contextRef.current = context;
        socket.emit('join', { name: props.gameId }, (response: { gameId: string, pNumber: number }) => {
          if (response.pNumber > 1) {
            player1 = 2;
            setIsReady(true);
          }
          setGameId(response.gameId);
        });
        const joinListener = (text: { ready: boolean }) => {
          if (text.ready) {
            setIsReady(true);
          }
          else {
            setIsReady(false);
          }
        }
        const messageListener = (text: GameCoords) => {
          context.fillStyle = "black"
          // contextRef?.current?.fillRect(0, 0, (canvas.width / 2), canvas.height)
          context.fillRect(0, 0, (canvas.width / 2), canvas.height)
          context.fillStyle = "white"
          let posy = (canvas.height / 2) * (text.p1y / 100);
          let posx = (canvas.width / 2) * (text.p1x / 100);

          context.fillRect(posx, posy, 10, paddleHeight);
          // contextRef?.current?.fillRect(posx, posy, 10, paddleHeight);
          posy = (canvas.height / 2) * (text.p2y / 100);
          posx = (canvas.width / 2) * (text.p2x / 100);
          // contextRef?.current?.fillRect(posx, posy, 10, paddleHeight);
          context.fillRect(posx, posy, 10, paddleHeight);
          // contextRef!.current!.font = "30px Arial";
          context.font = "30px Arial";

          if (player1 == 1) {
            context.font = "30px Arial";
            // contextRef!.current!.font = "30px Arial";
            context.fillStyle = "green"
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            // contextRef.current?.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            // contextRef!.current!.font = "30px Arial";
            context.font = "30px Arial";
            context.fillStyle = "red"
            // contextRef.current.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          } else {
            // contextRef.current.font = "30px Arial";
            context.font = "30px Arial";
            context.fillStyle = "red"
            // contextRef.current?.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            context.fillText(text.p1s.toString(), canvas.width / 4 - 100, 50);
            // contextRef!.current!.font = "30px Arial";
            context.font = "30px Arial";
            context.fillStyle = "green"
            context.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
            // contextRef.current?.fillText(text.p2s.toString(), canvas.width / 4 + 100, 50);
          }
          context.fillStyle = "yellow"
          posy = (canvas.height / 2) * (text.by / 100);
          posx = (canvas.width / 2) * (text.bx / 100);
          // contextRef.current?.fillRect(posx, posy, 10, 10);
          context.fillRect(posx, posy, 10, 10);

        };

        socket.on('message', messageListener);
        socket.on('roomJoined', joinListener);

        return () => {
          socket.off('message', messageListener);
          socket.off('join');
        };
      }
    }
    return;
  }, [canvasRef, window.innerWidth, window.innerHeight])


  function startDrawing(event: MouseEvent<HTMLCanvasElement>) {
    const clientY = event.clientY;
    if (isReady && canvasRef.current != null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const posy = ((clientY - rect.top) / (canvasRef.current.height / 2)) * 100;
      socket.emit('createMessage', { x: 59, y: posy, room: gameId, player: player1 }, (res: GameCoords) => {
        void (res);
      });
      //TODO remove x 
    }
  }


  return (
    <>
      < canvas onMouseMove={startDrawing} ref={canvasRef} />
    </>
  )
}

export default Game;
