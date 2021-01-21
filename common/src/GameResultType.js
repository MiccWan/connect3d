import Enum from './Enum.js';

// eslint-disable-next-line import/no-mutable-exports
let GameResultType = {
  PlayerAWins: 1,
  PlayerBWins: 2,
  NotOverYet: 3,
  Filled: 4,
};

GameResultType = new Enum(GameResultType);

export default GameResultType;

const gameEndTypes = new Set();
gameEndTypes.add(GameResultType.PlayerAWins);
gameEndTypes.add(GameResultType.PlayerBWins);
gameEndTypes.add(GameResultType.Filled);

export function isGameEnd(type) {
  return gameEndTypes.has(type);
}
