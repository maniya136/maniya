import React, { useState, useEffect } from 'react';
import './Auth.css';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLock } from 'react-icons/fi';
import { userApi } from '../../../../services/api';
import axios from 'axios';

export const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Set formValid to true to always enable the form
  const [formValid, setFormValid] = useState(true);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    
    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setFormValid(validateForm());
    }
  }, [formData, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      // setErrors(prev => ({
      //   ...prev,
      //   [name]: null
      // }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    console.log('Form validation failed');
    return;
  }
  
  setIsSubmitting(true);
  try {
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone.trim(),
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      city: formData.city.trim(),
      address: formData.address.trim()
    };
    
    console.log('Sending registration data:', userData);
    
    // Make the API call directly with axios to get better error details
    const response = await axios.post('https://localhost:7253/api/Users/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    
    console.log('Registration successful:', response.data);
    alert('Registration successful! You can now log in.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      gender: 'male',
      dateOfBirth: '',
      city: '',
      address: ''
    });
    
    // Redirect to login
    if (onNavigate) {
      onNavigate('login');
    }
    
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (status === 400 && data.errors) {
        // Handle validation errors
        const serverErrors = {};
        Object.keys(data.errors).forEach(key => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          serverErrors[fieldName] = data.errors[key][0];
        });
        console.log('Validation errors:', serverErrors);
        setErrors(serverErrors);
        return;
      } else if (data?.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      errorMessage = 'Error setting up request. Please try again.';
    }
    
    setErrors({ submit: errorMessage });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="form-header">
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">Join our community and unlock amazing features</p>
        </div>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-section">
            {/* <h3 className="section-title">Personal Information</h3> */}
            <div className="form-grid">
              <div className="form-group">
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Full Name"
                  />
                </div>
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Email Address"
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            {/* <h3 className="section-title">Account Security</h3> */}
            <div className="form-grid">

              <div className="form-group">
                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Create Password"
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm Password"
                  />
                </div>
                {/* {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>} */}
              </div>
            </div>
          </div>

          <div className="form-section">
            {/* <h3 className="section-title">Additional Information</h3> */}
            <div className="form-grid">

              <div className="form-group">
                <div className="input-group">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Phone Number"
                    maxLength="10"
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <div className="gender-radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                      />
                      <span>Male</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                      />
                      <span>Female</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      <span>Other</span>
                    </label>
                  </div>
                </div>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-grid">
              <div className="form-row">
                <div className="form-group">
                  <div className="input-group">
                    <FiCalendar className="input-icon" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? 'error' : ''}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                  <div className="input-group">
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="City"
                    />
                  </div>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group full-width">
                <div className="input-group">
                  <FiMapPin className="input-icon" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`address-input ${errors.address ? 'error' : ''}`}
                    placeholder="Full Address (Street, Building, Landmark)"
                    rows="3"
                  />
                </div>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={isSubmitting || !formValid}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>

          <p className="auth-footer">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={() => onNavigate && onNavigate('login')} 
              className="auth-link sign-in-btn"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};