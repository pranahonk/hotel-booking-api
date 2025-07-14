// Database configuration
export const config = {
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || "hotel_booking_jwt_secret_dev_only",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d"
};

// We'll set the MongoDB URI dynamically in the server startup code
