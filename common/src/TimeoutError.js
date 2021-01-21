export default class TimeoutError extends Error {
  constructor(...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }

    this.name = 'TimeoutError';
  }
}
