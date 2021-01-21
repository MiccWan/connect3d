import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: [true, 'Player name field is required.'],
  },
  token: {
    type: String,
    required: [true, 'Token field is required.'],
  }
});

const User = mongoose.model('save', userSchema);

export default User;
