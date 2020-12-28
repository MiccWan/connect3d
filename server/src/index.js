import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import newLogger from 'knect-common/src/Logger';
import Save from './models/save.js';

const log = newLogger('index');

const app = express();
const http = createServer(app);
const io = new Server(http);

// set NODE_ENV in dev mode
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}
else {
  throw new Error('proess.env.MONGO_URL does not exist');
}

const db = mongoose.connection;

db.on('error', (error) => {
  log.error(error);
});

db.once('open', () => {
  log.info('MongoDB connected!');

  Save.find()
    .limit(10)
    .exec((err, res) => {
      if (err) throw err;
      log.info('Current data in DB:', res);

      if (!res.length) {
        Save.create({
          players: ['test1', 'test2'],
          steps: ['1 0 0', '0 0 0']
        });
      }
    });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  io.on('connection', (socket) => {
    log.info('a user connected');
    socket.emit('msg', { msg: 'test msg' });
  });

  // host react frontend in production mode
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });

    app.get('*', (req, res) => {
      res.redirect('/');
    });
  }

  const PORT = process.env.PORT || 5000;

  http.listen(PORT, () => {
    log.info(`Server running on port ${PORT}`);
  });
});
