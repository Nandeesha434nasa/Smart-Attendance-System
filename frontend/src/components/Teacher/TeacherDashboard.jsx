import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import GenerateQR from './GenerateQR';

const TeacherDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getTeacherSessions();
      
      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '2rem', color: '#4f46e5' }}>Teacher Dashboard</h1>

      {/* Generate QR Section */}
      <GenerateQR onQRGenerated={loadSessions} />

      {/* Active Sessions */}
      <div className="card">
        <h2 className="card-title">Active Sessions</h2>
        
        {loading ? (
          <div className="info-text">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No active sessions</div>
          </div>
        ) : (
          <div className="attendance-list">
            {sessions.map((session, index) => (
              <div key={index} className="attendance-item">
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Subject:</span>
                  <span className="attendance-item-value">{session.subject}</span>
                </div>
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Session Code:</span>
                  <span className="attendance-item-value" style={{ 
                    fontWeight: 'bold', 
                    color: '#4f46e5',
                    fontSize: '1.1rem' 
                  }}>
                    {session.sessionCode}
                  </span>
                </div>
                <div className="attendance-item-row">
                  <span className="attendance-item-label">Expires:</span>
                  <span className="attendance-item-value">{formatDate(session.expiresAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;