import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import StudentsList from './StudentsList';
import Reports from './Reports';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    todayAttendance: 0,
    overallPercentage: 0
  });
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '2rem', color: '#4f46e5' }}>Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalTeachers}</div>
          <div className="stat-label">Total Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.todayAttendance}</div>
          <div className="stat-label">Today's Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.overallPercentage}%</div>
          <div className="stat-label">Overall %</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          All Students
        </button>
        <button 
          className={`admin-tab ${activeTab === 'defaulters' ? 'active' : ''}`}
          onClick={() => setActiveTab('defaulters')}
        >
          Defaulters
        </button>
        <button 
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'students' && (
        <StudentsList showDefaulters={false} />
      )}

      {activeTab === 'defaulters' && (
        <StudentsList showDefaulters={true} />
      )}

      {activeTab === 'reports' && (
        <Reports />
      )}
    </div>
  );
};

export default AdminDashboard;