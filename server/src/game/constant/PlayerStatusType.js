import Enum from 'knect-common/src/Enum.js';

// eslint-disable-next-line import/no-mutable-exports
let PlayerStatusType = {
  Login: 0,
  Lobby: 1,
  Room: 2
};

PlayerStatusType = new Enum(PlayerStatusType);

export default PlayerStatusType;
