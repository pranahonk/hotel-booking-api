import mongoose from 'mongoose';
import Room from '../models/Room.js';
import User from '../models/User.js';

// This script is meant to be imported and run after MongoDB connection is established

// Sample room data
const rooms = [
  {
    title: 'Deluxe King Room',
    description: 'Spacious room with king-sized bed, work desk, and city view. Features include air conditioning, free Wi-Fi, flat-screen TV, and private bathroom with premium amenities.',
    price: 199,
    capacity: 2,
    images: ['deluxe-king-1.jpg', 'deluxe-king-2.jpg'],
    features: ['King Bed', 'City View', 'Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Work Desk']
  },
  {
    title: 'Premium Double Room',
    description: 'Comfortable room with two double beds, perfect for families or groups. Includes air conditioning, free Wi-Fi, flat-screen TV, and private bathroom.',
    price: 249,
    capacity: 4,
    images: ['premium-double-1.jpg', 'premium-double-2.jpg'],
    features: ['Two Double Beds', 'Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge']
  },
  {
    title: 'Executive Suite',
    description: 'Luxurious suite with separate living area, king-sized bed, and panoramic city views. Includes premium amenities, work space, and access to executive lounge.',
    price: 349,
    capacity: 2,
    images: ['executive-suite-1.jpg', 'executive-suite-2.jpg'],
    features: ['King Bed', 'Separate Living Area', 'Panoramic View', 'Executive Lounge Access', 'Premium Amenities', 'Work Space']
  },
  {
    title: 'Family Suite',
    description: 'Spacious suite with one king bed and two twin beds in separate rooms. Perfect for families with children. Includes all standard amenities plus kids welcome package.',
    price: 399,
    capacity: 4,
    images: ['family-suite-1.jpg', 'family-suite-2.jpg'],
    features: ['King Bed', 'Two Twin Beds', 'Separate Rooms', 'Kids Welcome Package', 'Mini Fridge', 'Family Amenities']
  }
];

// Function to seed the database
export async function seedDatabase() {
  try {
    // Check if we already have rooms in the database
    const roomCount = await Room.countDocuments();
    
    if (roomCount > 0) {
      console.log(`Database already has ${roomCount} rooms, skipping seed`);
      return;
    }
    
    // Delete existing rooms if any
    await Room.deleteMany();
    console.log('Deleted existing rooms');
    
    // Insert new rooms
    await Room.insertMany(rooms);
    console.log('Sample rooms inserted successfully');
    
    // Create a test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Test user created');
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
