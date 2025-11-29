import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaRupeeSign, FaCheck } from 'react-icons/fa';

const VendorCard = ({ 
  vendor, 
  isSelected, 
  onSelect, 
  serviceId,
  price: propPrice 
}) => {
  const price = propPrice || vendor.price;
  
  return (
    <Card className={`mb-3 ${isSelected ? 'border-success' : ''}`}>
      <Card.Body>
        <Row>
          <Col md={8}>
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0 me-2">{vendor.businessName}</h5>
              <div className="d-flex align-items-center">
                <FaStar className="text-warning me-1" />
                <span>{vendor.rating || '4.5'}</span>
              </div>
            </div>
            <p className="text-muted mb-2">
              <FaMapMarkerAlt className="me-1" />
              {vendor.location || 'Mumbai, India'}
            </p>
            <div className="mb-2">
              <Badge bg="light" text="dark" className="me-2">
                {vendor.experience || '5+'} years experience
              </Badge>
              <Badge bg="light" text="dark">
                {vendor.eventsCompleted || '100+'} events
              </Badge>
            </div>
            <div className="d-flex align-items-center">
              <h5 className="mb-0 text-primary">
                <FaRupeeSign className="d-inline" />
                {price || 'Contact for price'}
              </h5>
              {price && <small className="ms-2 text-muted">starting from</small>}
            </div>
          </Col>
          <Col md={4} className="d-flex align-items-center justify-content-end">
            <Button 
              variant={isSelected ? 'outline-success' : 'outline-primary'}
              onClick={() => onSelect(vendor._id, serviceId, price, !isSelected)}
              className="w-100"
            >
              {isSelected ? <><FaCheck /> Selected</> : 'Select Vendor'}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VendorCard;
