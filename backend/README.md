# Smart Attendance System - Backend

Backend API for the Smart Attendance System built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication** with role-based access control
- **QR Code Generation** for attendance sessions
- **Geolocation Verification** to ensure students are physically present
- **RESTful API** endpoints for all operations
- **MongoDB Integration** for data persistence
- **Real-time Analytics** for attendance tracking

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **qrcode** - QR code generation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string

4. Start MongoDB (if using local):
```bash
mongod
```

5. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Attendance
- `POST /api/attendance/generate-qr` - Generate QR code (Teacher/Admin)
- `POST /api/attendance/mark` - Mark attendance (Student)
- `GET /api/attendance/my-attendance` - Get student's attendance (Student)
- `GET /api/attendance/teacher/sessions` - Get active sessions (Teacher)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics (Admin/Teacher)
- `GET /api/admin/students` - All students list (Admin/Teacher)
- `GET /api/admin/defaulters` - Students below 75% (Admin/Teacher)
- `GET /api/admin/attendance-report` - Generate report (Admin/Teacher)
- `GET /api/admin/subject-wise-attendance` - Subject stats (Admin/Teacher)

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model (students, teachers, admins)
│   ├── Attendance.js    # Attendance records
│   └── Session.js       # QR code sessions
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── attendance.js    # Attendance routes
│   └── admin.js         # Admin routes
├── middleware/
│   └── auth.js          # JWT verification middleware
├── server.js            # Main entry point
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a cloud MongoDB (MongoDB Atlas)
3. Deploy to platforms like:
   - Render
   - Heroku
   - Railway
   - DigitalOcean

## License

MIT
