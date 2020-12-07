import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

const app = express();

// set NODE_ENV in dev mode
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// host react frontend in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

  app.get('*', function (req, res) {
    res.redirect('/');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
