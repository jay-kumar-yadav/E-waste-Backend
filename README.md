# E-waste Backend API

A Node.js backend API for the E-waste management system built with Express.js and MongoDB.

## Features

- User authentication (register, login, Google OAuth)
- Admin authentication (register with secret key, login)
- Collection point management (CRUD operations)
- Admin dashboard with statistics
- Protected routes with JWT authentication
- Error handling middleware
- Input validation

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── collectionPointController.js  # Collection point CRUD
│   └── adminController.js   # Admin operations
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User schema
│   ├── Admin.js            # Admin schema
│   └── CollectionPoint.js  # Collection point schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── collectionPointRoutes.js  # Collection point routes
│   └── adminRoutes.js      # Admin routes
├── utils/
│   ├── generateToken.js    # JWT token generation
│   └── validators.js       # Input validation helpers
├── .env.example            # Environment variables template
├── package.json
└── server.js               # Main server file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret key
- Admin secret key
- Port number

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
node server.js
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login/register
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/admin/register` - Register admin
- `POST /api/auth/admin/login` - Login admin
- `GET /api/auth/admin/me` - Get current admin (Protected - Admin)

### Collection Point Routes (`/api/collection-points`)

All routes require authentication.

- `GET /api/collection-points` - Get user's collection points
- `POST /api/collection-points` - Create new collection point
- `GET /api/collection-points/:id` - Get single collection point
- `PUT /api/collection-points/:id` - Update collection point
- `DELETE /api/collection-points/:id` - Delete collection point

### Admin Routes (`/api/admin`)

All routes require admin authentication.

- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/collection-points` - Get all collection points
- `GET /api/admin/collection-points/:id` - Get single collection point
- `PUT /api/admin/collection-points/:id/status` - Update collection point status
- `DELETE /api/admin/collection-points/:id` - Delete collection point

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time (default: 30d)
- `ADMIN_SECRET_KEY` - Secret key required for admin registration

## Database Models

### User
- name, email, password, googleLogin, googleId, isAuthenticated

### Admin
- name, email, password, isAdmin, isAuthenticated

### CollectionPoint
- userId, userName, name, email, address, latitude, longitude
- wasteType, condition, yearsOfUse, optional, status

## Error Handling

The API uses a centralized error handler middleware that returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- Admin secret key protection
