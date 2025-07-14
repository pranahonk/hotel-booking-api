import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      required: [true, 'Booking must be for a room']
    },
    checkIn: {
      type: Date,
      required: [true, 'Booking must have a check-in date']
    },
    checkOut: {
      type: Date,
      required: [true, 'Booking must have a check-out date']
    },
    guests: {
      type: Number,
      required: [true, 'Booking must have number of guests']
    },
    price: {
      room: {
        type: Number,
        required: [true, 'Booking must have a room price']
      },
      tax: {
        type: Number,
        required: [true, 'Booking must have tax amount']
      },
      total: {
        type: Number,
        required: [true, 'Booking must have a total price']
      }
    },
    contactInfo: {
      title: {
        type: String,
        required: [true, 'Contact info must have a title']
      },
      name: {
        type: String,
        required: [true, 'Contact info must have a name']
      },
      email: {
        type: String,
        required: [true, 'Contact info must have an email']
      }
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for efficient querying by date ranges
bookingSchema.index({ checkIn: 1, checkOut: 1 });

// Add index for user's bookings
bookingSchema.index({ user: 1 });

// Pre-save middleware to calculate total price if not provided
bookingSchema.pre('save', function(next) {
  if (!this.price.total) {
    this.price.total = this.price.room + this.price.tax;
  }
  next();
});

// Pre-find middleware to populate user and room data
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'room',
    select: 'title price images'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
