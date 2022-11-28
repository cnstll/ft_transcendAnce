import {  GameInformation, GameStatus } from "../global-components/interface";

export function drawGameStatus(gameInfo: GameInformation, gameStatus: GameStatus) {
  if (gameInfo.context && gameInfo.canvas) {

    //Center Text Vertically 
    gameInfo.context.textBaseline = 'middle';
    //Center Text Horizontally
    gameInfo.context.textAlign = 'center';

    switch (gameStatus) {
      case GameStatus.PENDING:
        gameInfo.context.font = gameInfo.fontSize.toString() + 'px Aldrich';
        gameInfo.context.fillStyle = 'green';
        gameInfo.context.fillText(
          'Waiting for a partner...',
          gameInfo.canvas.width / 2,
          gameInfo.canvas.height / 2,
        );
        break;
      case GameStatus.PAUSED:
        gameInfo.context.font = gameInfo.fontSize.toString() + 'px Aldrich';
        gameInfo.context.fillStyle = 'green';
        gameInfo.context.fillText(
          'Opponent disconnected',
          window.innerWidth / 2,
          gameInfo.canvas.height / 2 - gameInfo.canvas.height / 8,
        );
        gameInfo.context.fillText(
          'You will win by default in 10s',
          window.innerWidth / 2,
          gameInfo.canvas.height / 2 + gameInfo.canvas.height / 8,
        );
        break;

      case GameStatus.OVER:
        gameInfo.context.font = gameInfo.fontSize.toString() + 'px Aldrich';
        if (
          (gameInfo.playerOneScore === 10 && gameInfo.playerNumber === 1) ||
            (gameInfo.playerOneScore !== 10 && gameInfo.playerNumber === 2)
        ) {
          gameInfo.context.fillStyle = 'green';
          gameInfo.context.fillText(
            'Congratulations, you won!',
            gameInfo.canvas.width / 2,
            gameInfo.canvas.height / 2,
          );
        } else {
          gameInfo.context.fillStyle = 'red';
          gameInfo.context.fillText(
            'Sorry, you lost!',
            gameInfo.canvas.width / 2,
            gameInfo.canvas.height / 2,
          );
        }
        break;
    }
  }
}
