import { useEffect, useRef, useState } from "react"
import { socket } from "./socket";

// let xPos = 50;
let player1: number = 1;
let paddleHeight = 50;
let gameId = null;

const Game = (props: any) => {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round"
    context.strokeStyle = "white"
    context.fillStyle = "white"
    contextRef.current = context;
    paddleHeight = canvas.height / 20;
    socket.emit('join', { name: props.gameId }, (response: any) => {
      if (response.pNumber > 1) {
        player1 = 2;
        setIsReady(true);
        // xPos = canvas.width / 2 - 50;
      }
      gameId = response.gameId;
      console.log(gameId);
    });

    const joinListener = (text) => {
      if (text.ready == true) {
        setIsReady(true);
      }
      else {
        console.log('here i am');
        setIsReady(false);
      }
    }

    const messageListener = (text) => {
      // console.log('you ve got mail', text);
      context.fillStyle = "black"
      contextRef.current.fillRect(0, 0, (canvas.width / 2), canvas.height)
      context.fillStyle = "white"
      let posy = (canvas.height / 2) * (text.p1y / 100);
      let posx = (canvas.width / 2) * (text.p1x / 100);

      contextRef.current.fillRect(posx, posy, 10, paddleHeight);
      posy = (canvas.height / 2) * (text.p2y / 100);
      posx = (canvas.width / 2) * (text.p2x / 100);
      contextRef.current.fillRect(posx, posy, 10, paddleHeight);
      contextRef.current.font = "30px Arial";

      if (player1 == 1) {
        contextRef.current.font = "30px Arial";
        context.fillStyle = "green"
        contextRef.current.fillText(text.p1s, canvas.width / 4 - 100, 50);
        contextRef.current.font = "30px Arial";
        context.fillStyle = "red"
        contextRef.current.fillText(text.p2s, canvas.width / 4 + 100, 50);
      } else {
        contextRef.current.font = "30px Arial";
        context.fillStyle = "red"
        contextRef.current.fillText(text.p1s, canvas.width / 4 - 100, 50);
        contextRef.current.font = "30px Arial";
        context.fillStyle = "green"
        contextRef.current.fillText(text.p2s, canvas.width / 4 + 100, 50);
      }
      context.fillStyle = "yellow"
      posy = (canvas.height / 2) * (text.by / 100);
      posx = (canvas.width / 2) * (text.bx / 100);
      contextRef.current.fillRect(posx, posy, 10, 10);

    };

    socket.on('message', messageListener);
    socket.on('roomJoined', joinListener);

    return () => {
      socket.off('message', messageListener);
      socket.off('join');
    };
  }, [window.innerWidth, window.innerHeight])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (isReady) {
      let posy = (offsetY / (canvasRef.current.height / 2)) * 100;
      let posx = (offsetX / (canvasRef.current.width / 2)) * 100;
      console.log(gameId);
      socket.emit('createMessage', { x: posx, y: posy, room: gameId, player: player1 }, (_: any) => { });
    }
  }


  return (
    // < canvas onMouseMove={startDrawing} ref={canvasRef} />
    <>
      < canvas onMouseMove={startDrawing} ref={canvasRef} />
    </>
  )
}

export default Game;
