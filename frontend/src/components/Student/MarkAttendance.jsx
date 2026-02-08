import React, { useState } from 'react';
import { attendanceAPI } from '../../services/api';

const MarkAttendance = ({ onAttendanceMarked }) => {
  const [sessionCode, setSessionCode] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setLocation('Getting your location...');

    // Get geolocation
    if (!navigator.geolocation) {
      setMessage({ text: 'Geolocation is not supported by your browser', type: 'error' });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        try {
          const response = await attendanceAPI.markAttendance({
            sessionCode,
            latitude,
            longitude
          });

          if (response.data.success) {
            setMessage({ text: response.data.message, type: 'success' });
            setSessionCode('');
            
            // Refresh dashboard
            if (onAttendanceMarked) {
              setTimeout(() => {
                onAttendanceMarked();
              }, 1000);
            }
          }
        } catch (error) {
          setMessage({ 
            text: error.response?.data?.error || 'Failed to mark attendance', 
            type: 'error' 
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setMessage({ 
          text: 'Unable to get your location. Please enable location access.', 
          type: 'error' 
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className="card">
      <h2 className="card-title">Mark Attendance</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Session Code (from QR)</label>
          <input
            type="text"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            placeholder="Enter session code"
            required
            disabled={loading}
          />
        </div>

        {location && (
          <div className="info-text">{location}</div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default MarkAttendance;