import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Room.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const rooms = await query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: rooms.length,
      data: {
        rooms
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a single room
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 'fail',
        message: 'No room found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        room
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Check room availability
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide roomId, checkIn and checkOut dates'
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

    // Find overlapping bookings
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

    const isAvailable = overlappingBookings.length === 0;

    res.status(200).json({
      status: 'success',
      data: {
        isAvailable,
        roomId,
        checkIn,
        checkOut
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
