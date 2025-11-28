import React, { useState } from 'react';
import './CreateEventSection.css';
import { useNavigate } from 'react-router-dom';
import ServicesPage from './ServicesPage';

const EventTypeModal = ({ onSelect, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Select Event Type</h3>
      <div className="event-type-options">
        <button type="button" className="event-type-btn" onClick={() => onSelect('custom')}>
          Custom Event
        </button>
        <button type="button" className="event-type-btn" onClick={() => onSelect('personal')}>
          Personal Event
        </button>
      </div>
      <button type="button" className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  </div>
);

export const CreateEventSection = ({ onNavigate }) => {
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [eventType, setEventType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    eventType: '',
    eventTitle: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    city: '',
    address: '',
    status: 'draft',
    guestLimit: '',
    eventTime: '',
    createdAt: new Date().toISOString().split('T')[0],
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventTypeSelect = (type) => {
    setEventType(type);
    setForm(prev => ({ ...prev, eventType: type }));
    setShowEventTypeModal(false);
    setCurrentStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validate form data if needed
      if (!form.eventTitle || !form.startDate || !form.city) {
        throw new Error('Please fill in all required fields');
      }
      
      // Move to the next step (services selection)
      setCurrentStep(2);
      
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error in form submission:', error);
      setMessage({
        text: error.message || 'Failed to proceed. Please check your inputs.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

const renderForm = () => {
  // STEP 1 → Show Event Form
  if (currentStep === 1) {
    return (
      <div className="event-form-container">
        <h2>Create {eventType === 'personal' ? 'Personal' : 'Custom'} Event</h2>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-grid">

            {/* Event Type */}
            <div className="form-group">
              <label>Event Type</label>
              <select 
                name="eventType" 
                value={form.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="personal">Personal</option>
                <option value="corporate">Corporate</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="conference">Conference</option>
              </select>
            </div>

            {/* Event Title */}
            <div className="form-group">
              <label>Event Title</label>
              <input 
                type="text" 
                name="eventTitle" 
                value={form.eventTitle}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Event Description</label>
              <textarea 
                name="eventDescription" 
                value={form.eventDescription}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={form.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>

            {/* End Date */}
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                name="endDate" 
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || new Date().toISOString().split('T')[0]}
                required 
              />
            </div>

            {/* Time */}
            <div className="form-group">
              <label>Event Time</label>
              <input 
                type="time" 
                name="eventTime" 
                value={form.eventTime}
                onChange={handleChange}
                required 
              />
            </div>

            {/* City */}
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                name="city" 
                value={form.city}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Address */}
            <div className="form-group full-width">
              <label>Address</label>
              <textarea 
                name="address" 
                value={form.address}
                onChange={handleChange}
                rows="2"
                required
              />
            </div>

            {/* Guest limit */}
            <div className="form-group">
              <label>Guest Limit</label>
              <input 
                type="number" 
                name="guestLimit" 
                value={form.guestLimit}
                onChange={handleChange}
                min="1"
                required 
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>
              <select 
                name="status" 
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Loading...' : 'Save & Continue'}
            </button>
          </div>

        </form>
      </div>
    );
  }

  // STEP 2 → Render ServicesPage
  if (currentStep === 2) {
    return (
      <div className="services-page-container">
        <h2>Select Services for Your Event</h2>
        <ServicesPage
          eventData={{
            ...form,
            guestLimit: form.guestLimit ? parseInt(form.guestLimit) : 0,
          }}
          onBack={() => setCurrentStep(1)}
        />
      </div>
    );
  }
};


  return (
    <div className="create-event-section">
      {showEventTypeModal && (
        <EventTypeModal 
          onSelect={handleEventTypeSelect} 
          onClose={() => setShowEventTypeModal(false)} 
        />
      )}
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}
      
      {renderForm()}
    </div>
  );
};
