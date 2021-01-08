import mongoose from 'mongoose';
import newLogger from 'knect-common/src/Logger.js';

const log = newLogger('DB');

export default async function initDB() {
  if (!process.env.MONGO_URL) {
    throw new Error('Missing environment configuration: proess.env.MONGO_URL');
  }

  const db = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  log.info('MongoDB connected!');

  return db;
}
