import Enum from 'knect-common/src/Enum.js';

// eslint-disable-next-line import/no-mutable-exports
let CheckResultType = {
  PlayerAWins: 1,
  PlayerBWins: 2,
  NotOverYet: 3,
  Filled: 4,
};

CheckResultType = new Enum(CheckResultType);

export default CheckResultType;
