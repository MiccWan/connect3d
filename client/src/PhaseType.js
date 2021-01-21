import Enum from 'knect-common/src/Enum.js';

/* eslint-disable import/no-mutable-exports */
let PhaseType = {
  WaitForLogin: 1,
  Login: 2,
  Lobby: 3,
  Room: 4
};

PhaseType = new Enum(PhaseType);

export default PhaseType;
