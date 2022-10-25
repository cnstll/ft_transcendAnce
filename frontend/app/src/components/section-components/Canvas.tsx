import { useEffect, useRef, useState } from "react"
import { io } from 'socket.io-client';

const Game = (props: any) => {
  const socket = io('http://localhost:3000');


  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

    // socket.on('createRoom');
    socket.emit('join', {}, (response: any) => {
      console.log('this is an emit on a join ', response);
    });
    // socket.on('message', text => {
    //   console.log('this is a messge event as a room creation event ', text);
    // })
    // socket.on('createRoom', text => {
    //   console.log('this is a messge event', text);
    // })
    socket.on('roomCreated', text => {
      console.log('this is a messge event in room created ', text);
    })
    // socket.emit('createRoom', 'hi');

    socket.on('message', text => {
      // console.log('hi');
      context.fillStyle = "black"
      contextRef.current.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = "white"
      contextRef.current.fillRect(text.x, text.y, 10, 10);
      // console.log('this is a messge event', text);
    })
  }, [])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socket.emit('createMessage', { x: 50, y: offsetY }, (response: any) => {
      // console.log('this is the response ', response);
    });
  }

  return (
    < canvas onMouseMove={startDrawing} ref={canvasRef} />
  )
}

export default Game;
