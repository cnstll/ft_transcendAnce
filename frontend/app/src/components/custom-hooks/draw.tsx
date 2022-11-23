import { GameCoords } from "../global-components/interface";



interface GameInformation {
  p1x: number,

  p2x: number,
  gameCoordinates: GameCoords,
  ballWidth: number,
  heightScalar: number,
  widthScalar: number,
  paddleWidth: number,
  paddleHeight: number,
  canvas: HTMLCanvasElement | null,
  context: CanvasRenderingContext2D | null, 
  cacheCanvas: OffscreenCanvas | null,
}

export function draw(gameContextInfo : GameInformation) {

  // console.log('i am here to chew bubblegum and kick ass');
  const context = gameContextInfo.context;
  const canvas = gameContextInfo.canvas;


  if (context && canvas && gameContextInfo.cacheCanvas) {
    const cacheCanvas: OffscreenCanvas = gameContextInfo.cacheCanvas;
    context.drawImage(cacheCanvas, 0, 0);

    // drawing the paddles
    context.fillStyle = 'white';
    context.fillRect(
      gameContextInfo.p1x,
      gameContextInfo.heightScalar * gameContextInfo.gameCoordinates.p1y - gameContextInfo.paddleHeight / 2,
      gameContextInfo.paddleWidth,
      gameContextInfo.paddleHeight,
    );
    context.fillRect(
      gameContextInfo.p2x,
      gameContextInfo.heightScalar * gameContextInfo.gameCoordinates.p2y - gameContextInfo.paddleHeight / 2,
      gameContextInfo.paddleWidth,
      gameContextInfo.paddleHeight,
    );

    if (gameContextInfo.gameCoordinates.p1s < 10) {
      context.font = '30px Aldrich';
      context.fillStyle = 'white';
      context.fillText(
        '0' + gameContextInfo.gameCoordinates.p1s.toString(),
        canvas.width / 2 - 100,
        50,
      );
    }
    if (gameContextInfo.gameCoordinates.p2s < 10) {
      context.font = '30px Aldrich';
      context.fillStyle = 'white';
      context.fillText(
        '0' + gameContextInfo.gameCoordinates.p2s.toString(),
        canvas.width / 2 + 100,
        50,
      );
    }
    if (gameContextInfo.gameCoordinates.p1s === 10) {
      context.font = '30px Aldrich';
      context.fillStyle = 'white';
      context.fillText(
        gameContextInfo.gameCoordinates.p1s.toString(),
        canvas.width / 2 - 100,
        50,
      );
    }
    if (gameContextInfo.gameCoordinates.p2s === 10) {
      context.font = '30px Aldrich';
      context.fillStyle = 'white';
      context.fillText(
        gameContextInfo.gameCoordinates.p2s.toString(),
        canvas.width / 2 + 100,
        50,
      );
    }
    //drawing the ball
    context.fillStyle = 'yellow';
    context.fillRect(
      gameContextInfo.widthScalar * (gameContextInfo.gameCoordinates.bx - gameContextInfo.ballWidth / 2),
      gameContextInfo.heightScalar * gameContextInfo.gameCoordinates.by,
      gameContextInfo.ballWidth,
      gameContextInfo.ballWidth,
    );
  }
}
