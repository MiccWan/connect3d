export default class RemoteError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, RemoteError);

    this.name = 'RemoteError';
  }
}
