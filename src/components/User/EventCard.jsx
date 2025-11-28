import React from 'react';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaEdit, FaTrash } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { 
    eventName, 
    eventDate, 
    location, 
    selectedServices = {},
    totalPrice = 0
  } = event;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{eventName}</h4>
          <div>
            <Button 
              variant="outline-light" 
              size="sm" 
              className="me-2"
              onClick={() => onEdit(event)}
            >
              <FaEdit className="me-1" /> Edit
            </Button>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={() => onDelete(event._id)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <p className="mb-1">
            <FaCalendarAlt className="me-2 text-muted" />
            <strong>Date:</strong> {formatDate(eventDate)}
          </p>
          <p className="mb-0">
            <FaMapMarkerAlt className="me-2 text-muted" />
            <strong>Location:</strong> {location}
          </p>
        </div>

        <h5>Selected Services</h5>
        <ListGroup variant="flush" className="mb-3">
          {Object.entries(selectedServices).map(([serviceId, serviceData]) => (
            <ListGroup.Item key={serviceId} className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{serviceData.serviceName}</h6>
                <small className="text-muted">Vendor: {serviceData.vendorName}</small>
              </div>
              <div className="text-end">
                <div className="text-nowrap">
                  <FaRupeeSign className="d-inline" />
                  {serviceData.price.toLocaleString()}
                </div>
                <Badge bg="info" className="ms-2">
                  {serviceData.serviceCategory}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="d-flex justify-content-between align-items-center border-top pt-3">
          <h5 className="mb-0">Total</h5>
          <h4 className="mb-0 text-primary">
            <FaRupeeSign className="d-inline" />
            {totalPrice.toLocaleString()}
          </h4>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light">
        <div className="d-flex justify-content-between">
          <Button variant="outline-secondary" size="sm">
            View Details
          </Button>
          <Button variant="primary" size="sm">
            Book Now
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default EventCard;
