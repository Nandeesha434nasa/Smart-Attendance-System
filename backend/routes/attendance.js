const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// @route   POST /api/attendance/generate-qr
// @desc    Generate QR code for attendance (Teachers only)
// @access  Private (Teacher)
router.post('/generate-qr', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { subject, latitude, longitude, duration } = req.body;

    if (!subject || !latitude || !longitude) {
      return res.status(400).json({ error: 'Please provide subject and location' });
    }

    // Generate unique session code
    const sessionCode = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate expiry time (default 15 minutes)
    const expiryMinutes = duration || 15;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Create session
    const session = await Session.create({
      teacher: req.user._id,
      subject,
      sessionCode,
      latitude,
      longitude,
      expiresAt
    });

    // Generate QR code
    const qrData = JSON.stringify({
      sessionCode,
      subject,
      teacherId: req.user._id,
      teacherName: req.user.name
    });

    const qrCodeImage = await QRCode.toDataURL(qrData);

    res.json({
      success: true,
      session: {
        id: session._id,
        sessionCode,
        subject,
        expiresAt,
        qrCode: qrCodeImage
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// @route   POST /api/attendance/mark
// @desc    Mark attendance by scanning QR code (Students only)
// @access  Private (Student)
router.post('/mark', protect, authorize('student'), async (req, res) => {
  try {
    const { sessionCode, latitude, longitude } = req.body;

    if (!sessionCode || !latitude || !longitude) {
      return res.status(400).json({ error: 'Please provide session code and location' });
    }

    // Find session
    const session = await Session.findOne({ sessionCode, isActive: true })
      .populate('teacher', 'name');

    if (!session) {
      return res.status(404).json({ error: 'Invalid or expired session' });
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      session.isActive = false;
      await session.save();
      return res.status(400).json({ error: 'Session has expired' });
    }

    // Check if student is within radius
    const distance = calculateDistance(
      session.latitude,
      session.longitude,
      latitude,
      longitude
    );

    if (distance > session.radius) {
      return res.status(400).json({ 
        error: `You are ${Math.round(distance)}m away. Must be within ${session.radius}m of the class location.` 
      });
    }

    // Check if attendance already marked for this session
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      student: req.user._id,
      subject: session.subject,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for this subject today' });
    }

    // Mark attendance
    const attendance = await Attendance.create({
      student: req.user._id,
      studentName: req.user.name,
      rollNumber: req.user.rollNumber,
      subject: session.subject,
      teacher: session.teacher._id,
      teacherName: session.teacher.name,
      status: 'present',
      latitude,
      longitude
    });

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: {
        subject: attendance.subject,
        date: attendance.date,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// @route   GET /api/attendance/my-attendance
// @desc    Get student's own attendance records
// @access  Private (Student)
router.get('/my-attendance', protect, authorize('student'), async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id })
      .sort({ date: -1 })
      .limit(50);

    // Calculate statistics
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses * 100).toFixed(2) : 0;

    res.json({
      success: true,
      stats: {
        totalClasses,
        presentCount,
        attendancePercentage
      },
      attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// @route   GET /api/attendance/teacher/sessions
// @desc    Get teacher's active sessions
// @access  Private (Teacher)
router.get('/teacher/sessions', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const sessions = await Session.find({ 
      teacher: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;
