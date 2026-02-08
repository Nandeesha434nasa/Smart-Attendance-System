const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin, Teacher)
router.get('/dashboard', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    // Get total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    
    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today }
    });

    // Get recent attendance records
    const recentAttendance = await Attendance.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('student', 'name rollNumber')
      .populate('teacher', 'name');

    // Calculate overall attendance percentage
    const totalClasses = await Attendance.countDocuments();
    const presentClasses = await Attendance.countDocuments({ status: 'present' });
    const overallPercentage = totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(2) : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        todayAttendance,
        overallPercentage
      },
      recentAttendance
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students with attendance stats
// @access  Private (Admin, Teacher)
router.get('/students', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ rollNumber: 1 });

    // Get attendance stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const totalClasses = await Attendance.countDocuments({ student: student._id });
        const presentClasses = await Attendance.countDocuments({ 
          student: student._id, 
          status: 'present' 
        });
        const attendancePercentage = totalClasses > 0 
          ? (presentClasses / totalClasses * 100).toFixed(2) 
          : 0;

        return {
          ...student.toObject(),
          attendanceStats: {
            totalClasses,
            presentClasses,
            attendancePercentage
          }
        };
      })
    );

    res.json({
      success: true,
      students: studentsWithStats
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// @route   GET /api/admin/defaulters
// @desc    Get students with low attendance (below 75%)
// @access  Private (Admin, Teacher)
router.get('/defaulters', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    
    const defaulters = [];

    for (const student of students) {
      const totalClasses = await Attendance.countDocuments({ student: student._id });
      const presentClasses = await Attendance.countDocuments({ 
        student: student._id, 
        status: 'present' 
      });
      
      if (totalClasses > 0) {
        const attendancePercentage = (presentClasses / totalClasses * 100);
        
        if (attendancePercentage < 75) {
          defaulters.push({
            ...student.toObject(),
            totalClasses,
            presentClasses,
            attendancePercentage: attendancePercentage.toFixed(2)
          });
        }
      }
    }

    // Sort by attendance percentage (lowest first)
    defaulters.sort((a, b) => a.attendancePercentage - b.attendancePercentage);

    res.json({
      success: true,
      defaulters
    });
  } catch (error) {
    console.error('Get defaulters error:', error);
    res.status(500).json({ error: 'Failed to fetch defaulters' });
  }
});

// @route   GET /api/admin/attendance-report
// @desc    Get attendance report (exportable as CSV)
// @access  Private (Admin, Teacher)
router.get('/attendance-report', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { startDate, endDate, subject } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (subject) {
      query.subject = subject;
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('student', 'name rollNumber department semester')
      .populate('teacher', 'name');

    res.json({
      success: true,
      records: attendanceRecords
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// @route   GET /api/admin/subject-wise-attendance
// @desc    Get subject-wise attendance statistics
// @access  Private (Admin, Teacher)
router.get('/subject-wise-attendance', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const subjectStats = await Attendance.aggregate([
      {
        $group: {
          _id: '$subject',
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          subject: '$_id',
          totalClasses: 1,
          presentCount: 1,
          attendancePercentage: {
            $multiply: [
              { $divide: ['$presentCount', '$totalClasses'] },
              100
            ]
          }
        }
      },
      {
        $sort: { subject: 1 }
      }
    ]);

    res.json({
      success: true,
      subjectStats
    });
  } catch (error) {
    console.error('Subject stats error:', error);
    res.status(500).json({ error: 'Failed to fetch subject statistics' });
  }
});

module.exports = router;
