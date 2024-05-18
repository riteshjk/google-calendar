import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  participants: [String],
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  sessionNotes: String,
  googleEventId: String,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
