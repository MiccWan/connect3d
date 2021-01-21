import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required.'],
  },
  token: {
    type: String,
    required: [true, 'Token field is required.'],
  }
});

const User = mongoose.model('user', userSchema);

export default User;
