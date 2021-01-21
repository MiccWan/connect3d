export default class TimeoutError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, TimeoutError);

    this.name = 'TimeoutError';
  }
}
