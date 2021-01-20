import Enum from '../Enum.js';

// eslint-disable-next-line import/no-mutable-exports
let PieceType = {
  PlayerA: 1,
  PlayerB: 2,
  Empty: 3,
};

PieceType = new Enum(PieceType);

export default PieceType;
