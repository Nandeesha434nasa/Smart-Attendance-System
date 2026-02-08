import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const StudentsList = ({ showDefaulters }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDefaulters]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      
      const response = showDefaulters 
        ? await adminAPI.getDefaulters()
        : await adminAPI.getStudents();
      
      if (response.data.success) {
        setStudents(showDefaulters ? response.data.defaulters : response.data.students);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card"><div className="info-text">Loading students...</div></div>;
  }

  if (students.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">
          {showDefaulters ? 'Defaulters (Below 75% Attendance)' : 'All Students'}
        </h2>
        <div className="empty-state">
          <div className="empty-state-icon">
            {showDefaulters ? '🎉' : '📋'}
          </div>
          <div className="empty-state-text">
            {showDefaulters 
              ? 'No defaulters! All students have good attendance.' 
              : 'No students found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">
        {showDefaulters ? 'Defaulters (Below 75% Attendance)' : 'All Students'}
      </h2>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const stats = showDefaulters 
                ? {
                    totalClasses: student.totalClasses,
                    presentClasses: student.presentClasses,
                    attendancePercentage: student.attendancePercentage
                  }
                : student.attendanceStats;

              const percentage = parseFloat(stats.attendancePercentage);
              
              return (
                <tr key={index}>
                  <td>{student.rollNumber || 'N/A'}</td>
                  <td>{student.name}</td>
                  <td>{student.department || 'N/A'}</td>
                  <td>{student.semester || 'N/A'}</td>
                  <td>{stats.totalClasses}</td>
                  <td>{stats.presentClasses}</td>
                  <td>
                    <span className={`status-badge ${percentage >= 75 ? 'present' : 'warning'}`}>
                      {stats.attendancePercentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;