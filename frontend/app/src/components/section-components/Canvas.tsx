import { useEffect, useRef, useState } from "react"
import { socket } from "./socket";

const Game = (props: any) => {


  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const xPos = 50;

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
    socket.emit('join', { name: 'id' }, (response: any) => {
      console.log('this is an emit on a join ', response);
    });

    const messageListener = (text) => {
      console.log('you ve got mail', text);
      context.fillStyle = "red"
      context.fillStyle = "red"
      // contextRef.current.fillRect(200 / 2, 0, (canvas.width), canvas.height)
      console.log("this is width ", window.innerWidth);
      console.log("this is width ", canvas.width);
      contextRef.current.fillRect((canvas.width / 4), 0, (canvas.width), canvas.height)
      context.fillStyle = "white"
      console.log(canvas.width);
      // contextRef.current.fillRect(canvas.width - 50, text.y, 10, 10);
      contextRef.current.fillRect((canvas.width / 2 - 50), text.y, 10, 10);
    };

    socket.on('message', messageListener)

    return () => {
      socket.off('message', messageListener);
      socket.off('join');
    };
  }, [window.innerWidth])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.fillStyle = "black"
    console.log('this is width', canvasRef.current.width / 2);
    contextRef.current.fillRect(0, 0, canvasRef.current.width / 4, canvasRef.current.height)
    contextRef.current.fillStyle = "white"
    contextRef.current.fillRect(xPos, offsetY, 10, 10);

    console.log('this is my client id to as i send this message ', socket.id);
    console.log('this is xpos ', xPos);
    socket.emit('createMessage', { x: xPos, y: offsetY, room: props.gameId }, (_: any) => {
    });
  }


  return (
    // < canvas onMouseMove={startDrawing} ref={canvasRef} />
    < canvas onMouseMove={startDrawing} ref={canvasRef} />
  )
}

export default Game;
