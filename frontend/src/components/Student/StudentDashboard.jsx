import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import MarkAttendance from './MarkAttendance';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    presentCount: 0,
    attendancePercentage: 0
  });
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getMyAttendance();
      
      if (response.data.success) {
        setStats(response.data.stats);
        setAttendance(response.data.attendance);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '2rem', color: '#4f46e5' }}>Student Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalClasses}</div>
          <div className="stat-label">Total Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.presentCount}</div>
          <div className="stat-label">Present</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.attendancePercentage}%</div>
          <div className="stat-label">Attendance</div>
        </div>
      </div>

      {/* Mark Attendance Section */}
      <MarkAttendance onAttendanceMarked={loadDashboard} />

      {/* Recent Attendance */}
      <div className="card">
        <h2 className="card-title">Recent Attendance</h2>
        
        {attendance.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No attendance records yet</div>
          </div>
        ) : (
          <div className="attendance-list">
            {attendance.map((record, index) => (
              <div key={index} className="attendance-item">
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Subject:</span>
                  <span className="attendance-item-value">{record.subject}</span>
                </div>
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Teacher:</span>
                  <span className="attendance-item-value">{record.teacherName}</span>
                </div>
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Date:</span>
                  <span className="attendance-item-value">{formatDate(record.date)}</span>
                </div>
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Status:</span>
                  <span className={`status-badge ${record.status}`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;