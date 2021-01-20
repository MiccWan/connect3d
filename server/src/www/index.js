import newLogger from 'knect-common/src/Logger.js';
import initExpress from './express.js';
import initSocket from './socket.js';

const log = newLogger('Web');

export default function initWeb() {
  const app = initExpress();
  const { httpServer, io } = initSocket(app);

  log.debug('initialized');

  return {
    async listen(port) {
      return new Promise((resolve, reject) => {
        httpServer.listen(port, resolve).once('error', reject);
      });
    },
    io
  };
}
