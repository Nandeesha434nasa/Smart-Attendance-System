const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Environment Variables (Your .env file)
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Connect to MongoDB (The Real Database)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected: Attendance System Online"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 4. Load Your Real Routes (These talk to the database)
// Make sure these files exist in your 'routes' folder!
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/attendance', require('./routes/attendance'));
    app.use('/api/admin', require('./routes/admin')); // If you have an admin route
} catch (error) {
    console.error("⚠️ Route loading error:", error.message);
}

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port: ${PORT}`);
});