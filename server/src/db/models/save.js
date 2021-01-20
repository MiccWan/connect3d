import mongoose from 'mongoose';

const saveSchema = new mongoose.Schema({
  players: {
    type: [String],
    required: [true, 'Players field is required.']
  },
  steps: {
    type: [Object],
    required: [true, 'Steps field is required.']
  }
});

const Save = mongoose.model('save', saveSchema);

export default Save;
