import Enum from 'knect-common/src/Enum';
import PieceType from 'knect-common/src/games/PieceType';

// eslint-disable-next-line import/no-mutable-exports
let TurnsType = {
  PlayerA: 1,
  PlayerB: 2,
  None: 3
};

TurnsType = new Enum(TurnsType);

export default TurnsType;

export function getPieceType(turns) {
  return PieceType[TurnsType.nameFrom(turns)];
}
