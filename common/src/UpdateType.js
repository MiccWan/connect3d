import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */

let types = {
  New: 1,
  Remove: 2,
};

types = new Enum(types);

export default types;
