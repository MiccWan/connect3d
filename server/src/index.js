import dotenv from 'dotenv';
import newLogger from 'knect-common/src/Logger.js';
// import initDB from './db/index.js';
import initGameCenter from './game/index.js';
import initWeb from './www/index.js';

const log = newLogger('index');

// set NODE_ENV in dev mode
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

async function init(port = 5000) {
  try {
    // await initDB();
    const { listen, io } = initWeb();

    initGameCenter(io);

    await listen(port);

    log.info(`Application initialized successfully, listening on port ${port}`);
  }
  catch (err) {
    log.error(err);
  }
}

init(process.env.PORT);
