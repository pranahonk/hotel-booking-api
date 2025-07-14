import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A room must have a title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A room must have a description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A room must have a price']
    },
    capacity: {
      type: Number,
      required: [true, 'A room must have a capacity']
    },
    images: [String],
    features: [String],
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate to get all bookings for this room
roomSchema.virtual('bookings', {
  ref: 'Booking',
  foreignField: 'room',
  localField: '_id'
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
