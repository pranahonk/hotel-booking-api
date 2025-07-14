# Hotel Booking API

This is the backend API for the Hotel Booking website. It provides endpoints for user authentication, room management, and booking operations.

## Features

- User authentication (register, login)
- Room listing and details
- Room availability checking
- Booking creation
- Booking management (view, cancel)
- User profile management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Deployment Guide

### Backend Deployment (Render)

1. **Prepare MongoDB Atlas Database:**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier)
   - Set up database access (create a user with password)
   - Set up network access (allow access from anywhere)
   - Get your connection string

2. **Deploy to Render:**
   - Sign up at [Render](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Configure the service:
     - Name: `hotel-booking-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables:
     - `PORT`: `8000`
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `JWT_EXPIRES_IN`: `30d`
   - Deploy

### Frontend Deployment (Netlify)

1. **Prepare the Frontend:**
   - Update API endpoint URLs in the frontend to point to your Render backend URL
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_API_URL=https://your-render-backend-url.onrender.com/api
     ```

2. **Deploy to Netlify:**
   - Sign up at [Netlify](https://www.netlify.com)
   - Connect your GitHub repository
   - Configure the build settings:
     - Base directory: `front-end` (or your frontend directory name)
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Deploy

## Local Development

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hotel-booking
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   ```

3. Seed the database with sample rooms:
   ```
   node src/utils/seedData.js
   ```

## API Endpoints

### Rooms

#### Get All Rooms
```
GET /api/rooms
```

**Query Parameters:**
- `price[gte]`: Filter rooms with price greater than or equal to specified value
- `price[lte]`: Filter rooms with price less than or equal to specified value
- `capacity`: Filter rooms by capacity
- `type`: Filter rooms by type (e.g., 'single', 'double', 'suite')
- `sort`: Sort results (e.g., `sort=price,-capacity` sorts by price ascending and capacity descending)
- `fields`: Select specific fields (e.g., `fields=name,price,capacity`)
- `page`: Page number for pagination
- `limit`: Number of results per page

**Example Request:**
```
GET https://hotel-booking-api.onrender.com/api/rooms?type=deluxe&price[gte]=150&price[lte]=300&sort=-price&limit=2
```

**Example Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "rooms": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Deluxe Ocean View",
        "description": "Luxurious room with panoramic ocean views and premium amenities",
        "type": "deluxe",
        "price": 289,
        "capacity": 2,
        "amenities": ["Air Conditioning", "Free WiFi", "TV", "Mini Bar", "Ocean View", "Balcony"],
        "images": [
          "https://example.com/rooms/deluxe-ocean-1.jpg",
          "https://example.com/rooms/deluxe-ocean-2.jpg"
        ],
        "bookings": [],
        "createdAt": "2025-06-19T10:15:23.456Z",
        "updatedAt": "2025-07-12T08:30:45.123Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Deluxe Mountain View",
        "description": "Spacious room with stunning mountain views and modern amenities",
        "type": "deluxe",
        "price": 249,
        "capacity": 2,
        "amenities": ["Air Conditioning", "Free WiFi", "TV", "Mini Bar", "Mountain View", "Balcony"],
        "images": [
          "https://example.com/rooms/deluxe-mountain-1.jpg",
          "https://example.com/rooms/deluxe-mountain-2.jpg"
        ],
        "bookings": [],
        "createdAt": "2025-06-19T11:20:33.789Z",
        "updatedAt": "2025-07-11T14:25:12.345Z"
      }
    ]
  }
}
```

**More Example Requests:**
```
# Get all rooms with price between $100 and $300
GET /api/rooms?price[gte]=100&price[lte]=300

# Get all double rooms sorted by price (lowest first)
GET /api/rooms?type=double&sort=price

# Get page 2 with 5 rooms per page, only showing name and price
GET /api/rooms?page=2&limit=5&fields=name,price
```

#### Get Room by ID
```
GET /api/rooms/:id
```

**Example:**
```
GET /api/rooms/60d21b4667d0d8992e610c85
```

#### Check Room Availability
```
GET /api/rooms/availability
```

**Query Parameters:**
- `roomId`: ID of the room to check (required)
- `checkIn`: Check-in date in ISO format (required)
- `checkOut`: Check-out date in ISO format (required)

**Example:**
```
GET /api/rooms/availability?roomId=60d21b4667d0d8992e610c85&checkIn=2025-08-01T14:00:00Z&checkOut=2025-08-05T11:00:00Z
```
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login a user
  - Body: `{ "email": "john@example.com", "password": "password123" }`

- `GET /api/auth/me` - Get current user profile (Protected)

### Rooms

- `GET /api/rooms` - Get all rooms
  - Query parameters for filtering:
    - `price[gte]=100` - Rooms with price greater than or equal to 100
    - `price[lte]=300` - Rooms with price less than or equal to 300
    - `capacity=2` - Rooms with capacity of 2
    - `sort=price` - Sort by price (ascending)
    - `sort=-price` - Sort by price (descending)
    - `page=1&limit=10` - Pagination

- `GET /api/rooms/:id` - Get a specific room

- `GET /api/rooms/availability` - Check room availability
  - Query parameters:
    - `roomId` - Room ID
    - `checkIn` - Check-in date (YYYY-MM-DD)
    - `checkOut` - Check-out date (YYYY-MM-DD)

### Bookings (All Protected)

- `POST /api/bookings` - Create a new booking
  - Body:
    ```json
    {
      "room": "roomId",
      "checkIn": "2023-09-01",
      "checkOut": "2023-09-05",
      "guests": 2,
      "contactInfo": {
        "title": "Mr",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
    ```

- `GET /api/bookings/my-bookings` - Get all bookings for the current user

- `GET /api/bookings/:id` - Get a specific booking

- `PATCH /api/bookings/:id/cancel` - Cancel a booking

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:
```json
{
  "status": "fail",
  "message": "Error message"
}
```

## Integration with Frontend

To integrate with the Vue.js frontend:

1. Update the API base URL in your frontend code to point to this backend server
2. Use the JWT token from login/register responses for authenticated requests
3. Store the token in localStorage or a secure cookie
4. Include the token in the Authorization header for protected routes
