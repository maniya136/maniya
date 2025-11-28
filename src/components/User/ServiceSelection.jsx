import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import ServiceCard from './ServiceCard';
import VendorSelection from './VendorSelection';
import { getServices } from '../../services/api';

const ServiceSelection = ({ selectedServices, onServiceSelect, onVendorSelect, onNext }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['all', ...new Set(services.map(service => service.category))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewVendors = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const handleBackToServices = () => {
    setSelectedServiceId(null);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (selectedServiceId) {
    return (
      <VendorSelection
        serviceId={selectedServiceId}
        serviceName={services.find(s => s._id === selectedServiceId)?.name}
        onBack={handleBackToServices}
        onVendorSelect={onVendorSelect}
        selectedVendors={selectedServices}
      />
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Select Services</h3>
        <Button 
          variant="primary" 
          onClick={onNext}
          disabled={Object.keys(selectedServices).length === 0}
        >
          Continue to Event Details
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={8}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard
                key={service._id}
                service={service}
                isSelected={!!selectedServices[service._id]}
                onSelect={onServiceSelect}
                onViewVendors={handleViewVendors}
              />
            ))
          ) : (
            <Alert variant="info">No services found matching your criteria.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceSelection;
