import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const EventDetailsForm = ({ event, selectedServices, onSubmit, onBack, loading }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    guestCount: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName || '',
        eventDate: event.eventDate || '',
        location: event.location || '',
        guestCount: event.guestCount || '',
        additionalNotes: event.additionalNotes || ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }
    
    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else if (new Date(formData.eventDate) < new Date()) {
      newErrors.eventDate = 'Event date must be in the future';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.guestCount) {
      newErrors.guestCount = 'Guest count is required';
    } else if (isNaN(formData.guestCount) || formData.guestCount < 1) {
      newErrors.guestCount = 'Please enter a valid number of guests';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        guestCount: parseInt(formData.guestCount, 10)
      });
    }
  };

  const calculateTotal = () => {
    return Object.values(selectedServices).reduce(
      (total, service) => total + (service.price || 0), 0
    );
  };

  return (
    <Row>
      <Col lg={8}>
        <h5 className="mb-4">Event Details</h5>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Event Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  isInvalid={!!errors.eventName}
                  placeholder="E.g., Wedding, Birthday Party"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.eventName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Event Date <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  isInvalid={!!errors.eventDate}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.eventDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  isInvalid={!!errors.location}
                  placeholder="Venue or address"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Guests <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  isInvalid={!!errors.guestCount}
                  min="1"
                  placeholder="Estimated number of guests"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.guestCount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any special requirements or instructions..."
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={onBack}
              disabled={loading}
            >
              <FaArrowLeft className="me-1" /> Back to Services
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </Form>
      </Col>
      
      <Col lg={4} className="mt-4 mt-lg-0">
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Order Summary</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h6 className="d-flex justify-content-between">
                <span>Event:</span>
                <span>{formData.eventName || 'Not specified'}</span>
              </h6>
              <div className="text-muted small">
                <div><FaCalendarAlt className="me-2" /> 
                  {formData.eventDate 
                    ? new Date(formData.eventDate).toLocaleString() 
                    : 'No date selected'}
                </div>
                <div className="mt-1">
                  <FaMapMarkerAlt className="me-2" /> 
                  {formData.location || 'No location specified'}
                </div>
              </div>
            </div>
            
            <h6 className="mb-2">Selected Services</h6>
            <ListGroup variant="flush" className="mb-3">
              {Object.values(selectedServices).map((service, index) => (
                <ListGroup.Item key={index} className="px-0">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{service.serviceName}</h6>
                      <small className="text-muted">{service.vendorName}</small>
                    </div>
                    <div className="text-nowrap">
                      <FaRupeeSign className="d-inline" />
                      {service.price.toLocaleString()}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
              
              {Object.keys(selectedServices).length === 0 && (
                <ListGroup.Item className="text-muted">
                  No services selected
                </ListGroup.Item>
              )}
            </ListGroup>
            
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span><FaRupeeSign className="d-inline" />{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (18%):</span>
                <span><FaRupeeSign className="d-inline" />{(calculateTotal() * 0.18).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span className="text-primary">
                  <FaRupeeSign className="d-inline" />
                  {(calculateTotal() * 1.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {Object.keys(selectedServices).length > 0 && (
          <Alert variant="info" className="mt-3">
            <h6>Next Steps</h6>
            <ol className="mb-0 ps-3">
              <li>Fill in the event details</li>
              <li>Review your order summary</li>
              <li>Click 'Save Event' to confirm</li>
            </ol>
          </Alert>
        )}
      </Col>
    </Row>
  );
};

export default EventDetailsForm;
