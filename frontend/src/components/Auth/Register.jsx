import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    department: 'Computer Science',
    semester: 6
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

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

    // Prepare data based on role
    const submitData = { ...formData };
    if (formData.role !== 'student') {
      delete submitData.rollNumber;
      delete submitData.semester;
    }

    try {
      await register(submitData);
      setMessage({ text: 'Registration successful! Redirecting...', type: 'success' });
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || 'Registration failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Register</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., CS001"
                />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  min="1"
                  max="8"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Already have an account? <a href="/login" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;