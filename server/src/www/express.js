import path from 'path';
import express from 'express';

export default function initExpress() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

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

  return app;
}
