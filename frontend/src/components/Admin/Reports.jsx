import React, { useState } from 'react';
import { adminAPI } from '../../services/api';

const Reports = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: ''
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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

    try {
      const params = {};
      if (formData.startDate) params.startDate = formData.startDate;
      if (formData.endDate) params.endDate = formData.endDate;

      const response = await adminAPI.getReport(params);
      
      if (response.data.success) {
        setRecords(response.data.records);
        setMessage({ 
          text: `Report generated successfully! Found ${response.data.records.length} records.`, 
          type: 'success' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || 'Failed to generate report', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (records.length === 0) {
      alert('Please generate a report first');
      return;
    }

    // Create CSV content
    let csvContent = 'Date,Student Name,Roll Number,Subject,Teacher,Status\n';
    
    records.forEach(record => {
      const date = new Date(record.date).toLocaleString();
      const row = [
        date,
        record.studentName,
        record.rollNumber,
        record.subject,
        record.teacherName,
        record.status
      ].join(',');
      csvContent += row + '\n';
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="card">
      <h2 className="card-title">Generate Report</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          
          {records.length > 0 && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={exportToCSV}
            >
              Export as CSV
            </button>
          )}
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>

      {/* Report Results */}
      {records.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#4f46e5' }}>
            Report Results ({records.length} records)
          </h3>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.studentName}</td>
                    <td>{record.rollNumber}</td>
                    <td>{record.subject}</td>
                    <td>{record.teacherName}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;