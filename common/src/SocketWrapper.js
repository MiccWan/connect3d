import newLogger from './Logger.js';
import ResponseType, { isResponseSuccessType } from './ResponseType.js';
import ForbiddenError from './ForbiddenError.js';
import RemoteError from './RemoteError.js';
import TimeoutError from './TimeoutError.js';

const log = newLogger('SocketWrapper');

const RequestTimeout = 10;

export default class SocketWrapper {
  constructor(socket) {
    this._socket = socket;
  }

  get id() {
    return this._socket.id;
  }

  init(requestsHandler, eventsHandler) {
    for (const [event, cb] of Object.entries(eventsHandler)) {
      this._socket.on(event, async (arg, ack) => {
        try {
          log.debug(`Get event '${event}'`, arg);
          await cb(arg);
          ack({ type: ResponseType.Success });
        }
        catch (err) {
          if (err instanceof ForbiddenError) {
            ack({ type: ResponseType.Forbidden, message: err.message });
          }
          else {
            log.error(`Error: Failed to process event ${event}.`, err);
            ack({ type: ResponseType.RemoteError, message: `Failed to process event '${event}'` });
          }
        }
      });
    }

    for (const [event, cb] of Object.entries(requestsHandler)) {
      this._socket.on(event, async (arg, ack) => {
        try {
          log.debug('Get Request', event, arg);
          const result = await cb(arg);
          ack({ type: ResponseType.Success, result });
        }
        catch (err) {
          if (err instanceof ForbiddenError) {
            ack({ type: ResponseType.Forbidden, message: err.message });
          }
          else {
            log.error(`Error: Failed to process request ${event}.`, err);
            ack({ type: ResponseType.RemoteError, message: `Failed to process request '${event}'` });
          }
        }
      });
    }
  }

  emit(event, arg) {
    if (!event) throw new TypeError(`Cannot emit empty event: ${event}`);

    this._socket.emit(event, arg, ({ type, message }) => {
      if (isResponseSuccessType(type)) {
        log.debug(`Event '${event}' handled successfully.`);
      }
      else if (type === ResponseType.Forbidden) {
        log.error(new ForbiddenError(message));
      }
      else if (type === ResponseType.RemoteError) {
        log.error(new RemoteError(message));
      }
      else {
        log.error(new Error(message));
      }
    });
  }

  async request(event, arg) {
    if (!event) throw new TypeError(`Cannot emit empty event '${event}'`);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new TimeoutError(`Request is not handled in ${RequestTimeout} second(s).`));
      }, RequestTimeout * 1000);
      this._socket.emit(event, arg, ({ type, result, message }) => {
        clearTimeout(timeout);
        if (isResponseSuccessType(type)) {
          log.debug('Received response from request', event, result);
          resolve(result);
        }
        else if (type === ResponseType.Forbidden) {
          reject(new ForbiddenError(message));
        }
        else if (type === ResponseType.RemoteError) {
          reject(new RemoteError(message));
        }
        else {
          reject(new Error(message));
        }
      });
    });
  }
}
