import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaInfoCircle, FaCheck } from 'react-icons/fa';

const ServiceCard = ({ service, isSelected, onSelect, onViewVendors }) => {
  return (
    <Card className={`mb-3 ${isSelected ? 'border-primary' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">{service.name}</h5>
            <p className="card-text text-muted">{service.description}</p>
            <Badge bg="info" className="me-2">
              {service.category}
            </Badge>
            <Badge bg="success">
              ₹{service.startingPrice}
            </Badge>
          </div>
          <div className="d-flex flex-column">
            <Button 
              variant={isSelected ? 'outline-primary' : 'primary'} 
              size="sm" 
              className="mb-2"
              onClick={() => onSelect(service._id, !isSelected)}
            >
              {isSelected ? <><FaCheck /> Selected</> : 'Select'}
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => onViewVendors(service._id)}
            >
              <FaInfoCircle /> Browse Vendors
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
