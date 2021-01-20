import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */

let types = {
  A: 1,
  B: 2,
};

types = new Enum(types);

export default types;
