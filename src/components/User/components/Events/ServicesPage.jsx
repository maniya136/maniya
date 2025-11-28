import React, { useState, useEffect } from 'react';
import { FaCheck, FaArrowRight, FaArrowLeft, FaUtensils, FaCamera, FaMapMarkerAlt, FaPalette, FaMusic, FaVideo, FaChevronLeft } from 'react-icons/fa';
import './ServicesPage.css';

// Enhanced service data with icons and more details
const SERVICES = [
  { 
    id: 1, 
    name: 'Catering', 
    description: 'Delicious food and beverage services for your event',
    icon: <FaUtensils className="service-icon" />
  },
  { 
    id: 2, 
    name: 'Photography', 
    description: 'Professional photography to capture your special moments',
    icon: <FaCamera className="service-icon" />
  },
  { 
    id: 3, 
    name: 'Venue', 
    description: 'Beautiful event spaces and locations for any occasion',
    icon: <FaMapMarkerAlt className="service-icon" />
  },
  { 
    id: 4, 
    name: 'Decor', 
    description: 'Stunning decoration and theming services',
    icon: <FaPalette className="service-icon" />
  },
  { 
    id: 5, 
    name: 'Entertainment', 
    description: 'Live music, DJs, and performers to liven up your event',
    icon: <FaMusic className="service-icon" />
  },
  { 
    id: 6, 
    name: 'Audio/Visual', 
    description: 'Professional sound and lighting equipment',
    icon: <FaVideo className="service-icon" />
  },
];

// Enhanced vendor data with more details
const VENDORS = {
  'Catering': [
    { 
      id: 1, 
      name: 'Tasty Bites', 
      rating: 4.5, 
      price: '$$', 
      available: true,
      description: 'Specializing in gourmet cuisine with customizable menus',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 2, 
      name: 'Gourmet Delights', 
      rating: 4.8, 
      price: '$$$', 
      available: true,
      description: 'Premium catering with farm-to-table ingredients',
      image: 'https://images.unsplash.com/photo-1544025162-1a07e2a1fdfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  'Photography': [
    { 
      id: 3, 
      name: 'Shutter Perfect', 
      rating: 4.7, 
      price: '$$', 
      available: true,
      description: 'Capturing your special moments with creativity',
      image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 4, 
      name: 'Lens Masters', 
      rating: 4.9, 
      price: '$$$', 
      available: true,
      description: 'Professional photography for unforgettable memories',
      image: 'https://images.unsplash.com/photo-1526170375885-4edd8f048b05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  'Venue': [
    { 
      id: 5, 
      name: 'Grand Hall', 
      rating: 4.6, 
      price: '$$$', 
      available: true,
      description: 'Elegant venue with a capacity of up to 500 guests',
      image: 'https://images.unsplash.com/photo-1541178370032-cb48160de2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 6, 
      name: 'Garden Oasis', 
      rating: 4.8, 
      price: '$$$$', 
      available: true,
      description: 'Beautiful outdoor venue with lush gardens',
      image: 'https://images.unsplash.com/photo-1519671482749-5f2cdb8f5a3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  'Decor': [
    { 
      id: 7, 
      name: 'Elegant Designs', 
      rating: 4.4, 
      price: '$$', 
      available: true,
      description: 'Creating magical atmospheres for your events',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 8, 
      name: 'Theme Masters', 
      rating: 4.7, 
      price: '$$$', 
      available: true,
      description: 'Custom themes and decorations to match your vision',
      image: 'https://images.unsplash.com/photo-1519671482749-5f2cdb8f5a3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  'Entertainment': [
    { 
      id: 9, 
      name: 'DJ Pro', 
      rating: 4.5, 
      price: '$$', 
      available: true,
      description: 'Keeping the party alive with the best music',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 10, 
      name: 'Live Band', 
      rating: 4.9, 
      price: '$$$$', 
      available: true,
      description: 'Professional musicians for an unforgettable performance',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  'Audio/Visual': [
    { 
      id: 11, 
      name: 'AV Solutions', 
      rating: 4.6, 
      price: '$$', 
      available: true,
      description: 'Professional audio and visual equipment rental',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 12, 
      name: 'Tech Events', 
      rating: 4.8, 
      price: '$$$', 
      available: true,
      description: 'Cutting-edge technology for your event needs',
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
};

const ServicesPage = ({ eventData = {}, onBack }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVendors, setSelectedVendors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading event data
    const timer = setTimeout(() => {
      // Set default event data if not provided
      if (!eventData.eventName) {
        eventData = {
          eventName: 'My Awesome Event',
          eventDate: '2023-12-25',
          eventType: 'Wedding',
          guestCount: 100,
          location: 'New York, NY'
        };
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [eventData]);

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Handle final submission
      const finalData = {
        ...eventData,
        services: selectedServices,
        vendors: selectedVendors,
        totalCost: calculateTotalCost(),
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
     
      console.log('Final event data:', finalData);
      // Here you would typically send this data to your backend
      // For now, we'll navigate to a confirmation page
      navigate('/booking-confirmation', { state: { booking: finalData } });
    }
  };

  const calculateTotalCost = () => {
    return Object.values(selectedVendors).reduce((total, vendor) => {
      if (!vendor) return total;
      // Simple calculation based on price indicators
      const priceMap = { '$': 100, '$$': 250, '$$$': 500, '$$$$': 1000 };
      return total + (priceMap[vendor.price] || 0);
    }, 0);
  };

  const renderServiceCard = (service) => {
    const isSelected = selectedServices.includes(service.id);
  
    return (
      <div 
        key={service.id}
        className={`service-card ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleService(service.id)}
      >
        <div className="service-card-content">
          <div className="service-icon">
            {service.icon}
          </div>
          <div className="service-details">
            <h4>{service.name}</h4>
            <p>{service.description}</p>
          </div>
          {isSelected && (
            <div className="selected-indicator">
              <FaCheck />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVendorCard = (service, vendor) => {
    const isSelected = selectedVendors[service.id] === vendor.id;
  
    return (
      <div 
        key={vendor.id}
        className={`vendor-card ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedVendors(prev => ({ ...prev, [service.id]: vendor }))}
      >
        <div className="vendor-image-container">
          <div 
            className="vendor-image" 
            style={{ backgroundImage: `url(${vendor.image})` }} 
          />
          <div className="vendor-overlay">
            {vendor.available ? (
              <span className="availability available">Available</span>
            ) : (
              <span className="availability unavailable">Unavailable</span>
            )}
          </div>
        </div>
       
        <div className="vendor-details">
          <div className="vendor-header">
            <h4>{vendor.name}</h4>
            <span className="price-badge">{vendor.price}</span>
          </div>
         
          <div className="vendor-rating">
            {Array(5).fill().map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(vendor.rating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{vendor.rating}</span>
          </div>
         
          <p className="vendor-description">{vendor.description}</p>
         
          <div className="vendor-features">
            <span className="feature">✓ Free Cancellation</span>
            <span className="feature">✓ Secure Booking</span>
          </div>
        </div>
       
        {isSelected && (
          <div className="selected-indicator">
            <FaCheck />
          </div>
        )}
      </div>
    );
  };

  const renderVendorsSection = () => {
    return (
      <div className="vendors-grid">
        {selectedServices.map(serviceId => {
          const service = SERVICES.find(s => s.id === serviceId);
          if (!service) return null;
          
          return (
            <div key={serviceId} className="vendor-category">
              <h3>
                {service.icon}
                {service.name} Vendors
              </h3>
              <div className="vendors-list">
                {(VENDORS[service.name] || []).map(vendor => 
                  renderVendorCard(service, vendor)
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="services-page-container">
      <div className="services-page">
        <div className="page-header">
          <button onClick={onBack} className="back-button">
            <FaChevronLeft /> Back
          </button>
          <h2>Select Services for Your Event</h2>
          <div className="event-summary">
            <h3>{eventData?.eventName || 'New Event'}</h3>
            <p>{eventData?.eventDate} • {eventData?.location}</p>
          </div>
        </div>
       
        <div className="services-content">
          {currentStep === 1 ? (
            <div className="services-selection">
              <div className="section-header">
                <h3>Select Services</h3>
                <p className="subtitle">Choose the services you need for your event</p>
              </div>
              
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="services-grid">
                {SERVICES
                  .filter(service => 
                    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(service => renderServiceCard(service))}
              </div>

              {selectedServices.length > 0 && (
                <div className="selected-services">
                  <h4>Selected Services ({selectedServices.length})</h4>
                  <div className="selected-tags">
                    {selectedServices.map(serviceId => {
                      const service = SERVICES.find(s => s.id === serviceId);
                      if (!service) return null;
                      
                      return (
                        <span key={serviceId} className="service-tag">
                          {service.name}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(serviceId);
                            }}
                            className="remove-tag"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="action-footer">
                <button 
                  className={`continue-button ${selectedServices.length === 0 ? 'disabled' : ''}`}
                  onClick={handleContinue}
                  disabled={selectedServices.length === 0}
                >
                  {selectedServices.length > 0 ? (
                    <>
                      Continue to Vendor Selection <FaArrowRight />
                    </>
                  ) : (
                    <>
                      Complete Booking (${calculateTotalCost()})
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="vendors-selection">
              <div className="section-header">
                <h3>Select Vendors</h3>
                <p className="subtitle">Choose your preferred vendors for each service</p>
              </div>
              
              {renderVendorsSection()}
              
              <div className="action-footer">
                <button 
                  className="back-button" 
                  onClick={() => setCurrentStep(1)}
                >
                  <FaArrowLeft /> Back to Services
                </button>
                <button 
                  className={`continue-button ${Object.keys(selectedVendors).length !== selectedServices.length ? 'disabled' : ''}`}
                  onClick={handleContinue}
                  disabled={Object.keys(selectedVendors).length !== selectedServices.length}
                >
                  {isSubmitting ? 'Processing...' : `Complete Booking ($${calculateTotalCost()})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
