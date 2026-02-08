import React, { useState } from 'react';
import { attendanceAPI } from '../../services/api';

const GenerateQR = ({ onQRGenerated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    duration: 15
  });
  const [qrData, setQrData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setLocation('Getting your location...');
    setQrData(null);

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
          const response = await attendanceAPI.generateQR({
            subject: formData.subject,
            latitude,
            longitude,
            duration: parseInt(formData.duration)
          });

          if (response.data.success) {
            setQrData(response.data.session);
            setMessage({ text: 'QR Code generated successfully!', type: 'success' });
            
            // Refresh sessions list
            if (onQRGenerated) {
              setTimeout(() => {
                onQRGenerated();
              }, 1000);
            }
          }
        } catch (error) {
          setMessage({ 
            text: error.response?.data?.error || 'Failed to generate QR code', 
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="card">
      <h2 className="card-title">Generate Attendance QR Code</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Data Structures"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="5"
            max="60"
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
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>

      {/* QR Code Display */}
      {qrData && (
        <div className="qr-container">
          <img 
            src={qrData.qrCode} 
            alt="QR Code" 
            className="qr-image"
          />
          
          <div className="qr-info">
            <div className="qr-info-item">
              <span className="qr-info-label">Subject:</span>
              <span className="qr-info-value">{qrData.subject}</span>
            </div>
            <div className="qr-info-item">
              <span className="qr-info-label">Session Code:</span>
              <span className="qr-info-value" style={{ 
                fontWeight: 'bold', 
                color: '#4f46e5',
                fontSize: '1.2rem' 
              }}>
                {qrData.sessionCode}
              </span>
            </div>
            <div className="qr-info-item">
              <span className="qr-info-label">Expires:</span>
              <span className="qr-info-value">{formatDate(qrData.expiresAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;