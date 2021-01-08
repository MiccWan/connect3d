import newLogger from './Logger.js';

const log = newLogger('SocketWrapper');

const RequestTimeOut = 10 * 1000;

export default class SocketWrapper {
  constructor(socket) {
    this._socket = socket;
  }

  init(requestsHandler, eventsHandler) {
    for (const [event, cb] of Object.entries(requestsHandler)) {
      this._socket.on(event, async (arg, ack) => {
        try {
          const result = await cb(arg);
          ack({ result });
        }
        catch (err) {
          ack({ error: err.message });
        }
      });
    }

    for (const [event, cb] of Object.entries(eventsHandler)) {
      this._socket.on(event, async (arg, ack) => {
        try {
          await cb(arg);
          ack({ result: `Event '${event}' successfully processed.` });
        }
        catch (err) {
          ack({ error: `Error processing event '${event}', ${err.message}` });
        }
      });
    }
  }

  emit(event, arg) {
    this._socket.emit(event, arg, ({ result, error }) => {
      if (!error) {
        log.debug(`Server response: ${result}`);
      }
      else {
        log.error(error);
      }
    });
  }

  async request(event, arg) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Request has not received response for ${RequestTimeOut / 1000} second(s).`));
      }, RequestTimeOut);
      this._socket.emit(event, arg, (response) => {
        clearTimeout(timeout);
        if (!response.error) {
          resolve(response.result);
        }
        else {
          reject(new Error(`Error when processing response: ${response.error}`));
        }
      });
    });
  }
}
