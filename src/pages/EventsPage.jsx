import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ServiceSelection from '../components/User/ServiceSelection';
import EventCard from '../components/User/EventCard';
import EventDetailsForm from '../components/User/EventDetailsForm';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../services/api';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('my-events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedServices, setSelectedServices] = useState({});
  const [step, setStep] = useState(1); // 1: Service Selection, 2: Event Details

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (serviceId, isSelected) => {
    if (isSelected) {
      // Remove service and its vendor if deselected
      const newSelectedServices = { ...selectedServices };
      delete newSelectedServices[serviceId];
      setSelectedServices(newSelectedServices);
    }
    // Selection of vendors is handled in the VendorSelection component
  };

  const handleVendorSelect = (vendorId, serviceId, price, isSelected) => {
    if (!isSelected) {
      // If deselecting, remove the service from selection
      const newSelectedServices = { ...selectedServices };
      delete newSelectedServices[serviceId];
      setSelectedServices(newSelectedServices);
      return;
    }

    // Find the service and vendor details
    // In a real app, you would fetch this from your API
    const service = {
      serviceId,
      serviceName: `Service ${serviceId.substring(0, 5)}`,
      serviceCategory: 'Category',
      vendorId,
      vendorName: `Vendor ${vendorId.substring(0, 5)}`,
      price: parseFloat(price) || 0,
    };

    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: service
    }));
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBackToServices = () => {
    setStep(1);
  };

  const handleSubmitEvent = async (eventData) => {
    try {
      setLoading(true);
      const eventPayload = {
        ...eventData,
        selectedServices,
        totalPrice: Object.values(selectedServices).reduce(
          (total, service) => total + (service.price || 0), 0
        ),
      };

      if (currentEvent) {
        // Update existing event
        await updateEvent(currentEvent._id, eventPayload);
      } else {
        // Create new event
        await createEvent(eventPayload);
      }

      // Reset form and fetch updated events
      setShowEventForm(false);
      setCurrentEvent(null);
      setSelectedServices({});
      setStep(1);
      fetchEvents();
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setSelectedServices(event.selectedServices || {});
    setShowEventForm(true);
    setStep(1);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await deleteEvent(eventId);
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderEventForm = () => {
    if (step === 1) {
      return (
        <ServiceSelection
          selectedServices={selectedServices}
          onServiceSelect={handleServiceSelect}
          onVendorSelect={handleVendorSelect}
          onNext={handleNextStep}
        />
      );
    }

    return (
      <EventDetailsForm
        event={currentEvent}
        selectedServices={selectedServices}
        onSubmit={handleSubmitEvent}
        onBack={handleBackToServices}
        loading={loading}
      />
    );
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>My Events</h2>
          <p className="text-muted">Manage your upcoming and past events</p>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={() => {
              setCurrentEvent(null);
              setSelectedServices({});
              setShowEventForm(true);
              setStep(1);
            }}
          >
            <FaPlus className="me-1" /> Create New Event
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {showEventForm ? (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h4 className="mb-4">
            {currentEvent ? 'Edit Event' : 'Create New Event'}
            <Button 
              variant="link" 
              className="float-end" 
              onClick={() => {
                setShowEventForm(false);
                setCurrentEvent(null);
                setSelectedServices({});
                setStep(1);
              }}
            >
              Cancel
            </Button>
          </h4>
          {renderEventForm()}
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="upcoming" title="Upcoming Events">
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : events.length > 0 ? (
              events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))
            ) : (
              <Alert variant="info">
                No upcoming events found. Create your first event to get started!
              </Alert>
            )}
          </Tab>
          <Tab eventKey="past" title="Past Events">
            <Alert variant="info">
              Your past events will appear here.
            </Alert>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default EventsPage;
