import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */
let ResponseType = {
  Success: 1,
  RemoteError: 2,
  Forbidden: 3
};

ResponseType = new Enum(ResponseType);

export default ResponseType;

const validTypes = new Set();
validTypes.add(ResponseType.Success);

export function isResponseSuccessType(resType) {
  return validTypes.has(resType);
}
