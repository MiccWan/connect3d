export default class ForbiddenError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, ForbiddenError);

    this.name = 'OperationForbidden';
  }
}
