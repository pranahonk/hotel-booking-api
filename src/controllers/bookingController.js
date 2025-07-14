import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Add user ID from authenticated user
    req.body.user = req.user.id;
    
    // Accept both 'room' and 'roomId' parameters for better API flexibility
    let roomId = req.body.room;
    if (!roomId && req.body.roomId) {
      roomId = req.body.roomId;
    }
    
    const { checkIn, checkOut } = req.body;
    
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        status: 'fail',
        message: 'No room found with that ID'
      });
    }
    
    // Convert string dates to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check if dates are valid
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Check-in date must be before check-out date'
      });
    }
    
    // Check room availability
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: 'confirmed',
      $or: [
        // New check-in date falls between an existing booking's check-in and check-out dates
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate }
        },
        // New check-out date falls between an existing booking's check-in and check-out dates
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate }
        },
        // New booking completely contains an existing booking
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate }
        }
      ]
    });
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Room is not available for the selected dates'
      });
    }
    
    // Calculate number of nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Calculate prices if not provided
    if (!req.body.price) {
      req.body.price = {
        room: room.price * nights,
        tax: room.price * nights * 0.09, // 9% tax
        total: room.price * nights * 1.09 // Room price + tax
      };
    }
    
    // Create booking
    const newBooking = await Booking.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all bookings for the current user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'No booking found with that ID'
      });
    }
    
    // Check if the booking belongs to the current user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this booking'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'No booking found with that ID'
      });
    }
    
    // Check if the booking belongs to the current user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to cancel this booking'
      });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'fail',
        message: 'This booking is already cancelled'
      });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
