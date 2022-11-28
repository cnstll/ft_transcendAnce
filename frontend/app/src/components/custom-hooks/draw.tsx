import { GameInformation } from "../global-components/interface";



export function cacheCanvas(gameContextInfo: GameInformation) {
  const context = gameContextInfo.context;
  const canvas = gameContextInfo.canvas;
  if (context && canvas) {
    const retCanvas = new OffscreenCanvas(canvas.width, canvas.height);
    const cacheContext = retCanvas.getContext('2d');

    if (cacheContext){
      cacheContext.fillStyle = 'black';
      cacheContext.fillRect(0, 0, canvas.width, canvas.height);
      cacheContext.strokeStyle = 'white';
      cacheContext.setLineDash([10, 10]);
      cacheContext.moveTo(canvas.width / 2, 0);
        cacheContext.lineTo(canvas.width / 2, canvas.height);
        cacheContext.stroke();
    }
    return retCanvas;
}
  return new OffscreenCanvas(300, 300);
}

export function draw(gameContextInfo : GameInformation) {

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
