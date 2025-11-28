import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';
import VendorCard from './VendorCard';
import { getVendorsByService } from '../../services/api';

const VendorSelection = ({ serviceId, serviceName, onBack, onVendorSelect, selectedVendors }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rating: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getVendorsByService(serviceId);
        setVendors(response.data);
      } catch (err) {
        setError('Failed to load vendors. Please try again.');
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchVendors();
    }
  }, [serviceId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      rating: '',
      location: ''
    });
    setSearchTerm('');
  };

  const filteredVendors = vendors.filter(vendor => {
    // Search term filter
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const price = vendor.price || 0;
    const minPrice = parseFloat(filters.minPrice) || 0;
    const maxPrice = parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    
    // Rating filter
    const rating = parseFloat(vendor.rating) || 0;
    const minRating = parseFloat(filters.rating) || 0;
    const matchesRating = rating >= minRating;
    
    // Location filter
    const matchesLocation = !filters.location || 
      (vendor.location && vendor.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    return matchesSearch && matchesPrice && matchesRating && matchesLocation;
  });

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading vendors...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Button 
        variant="outline-secondary" 
        onClick={onBack}
        className="mb-3"
      >
        <FaArrowLeft className="me-1" /> Back to Services
      </Button>
      
      <h3 className="mb-4">Select Vendor for {serviceName}</h3>
      
      <Row className="mb-4">
        <Col md={8}>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-4"
            />
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          </div>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="me-2"
          >
            <FaFilter className="me-1" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Col>
      </Row>
      
      {showFilters && (
        <div className="p-3 mb-4 bg-light rounded">
          <h5>Filter Vendors</h5>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Min Price (₹)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Max Price (₹)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Min Rating</Form.Label>
                <Form.Select 
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ stars</option>
                  <option value="4.0">4.0+ stars</option>
                  <option value="3.5">3.5+ stars</option>
                  <option value="3.0">3.0+ stars</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control 
                  type="text" 
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City or area"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}
      
      <Row>
        <Col>
          {filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => {
              const isSelected = selectedVendors[serviceId]?.vendorId === vendor._id;
              return (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  isSelected={isSelected}
                  onSelect={onVendorSelect}
                  serviceId={serviceId}
                  price={selectedVendors[serviceId]?.price || vendor.price}
                />
              );
            })
          ) : (
            <Alert variant="info">No vendors found matching your criteria.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VendorSelection;
