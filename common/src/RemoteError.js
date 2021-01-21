export default class RemoteError extends Error {
  constructor(...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemoteError);
    }

    this.name = 'RemoteError';
  }
}
