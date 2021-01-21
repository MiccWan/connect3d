import Enum from 'knect-common/src/Enum.js';

/* eslint-disable import/no-mutable-exports */
let PhaseType = {
  Login: 1,
  Lobby: 2,
  Room: 3
};

PhaseType = new Enum(PhaseType);

export default PhaseType;
