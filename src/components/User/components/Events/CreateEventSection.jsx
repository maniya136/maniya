import React, { useState } from "react";
import "./CreateEventSection.css";
import { useNavigate } from "react-router-dom";
import ServicesPage from "./ServicesPage";
import { customEventsApi, personalEventsApi } from "../../../../services/api";

const EventTypeModal = ({ onSelect, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Select Event Type</h3>
      <p className="modal-subtitle">
        Choose the type of event you want to create
      </p>
      <div className="event-type-options">
        <button
          type="button"
          className="event-type-btn"
          onClick={() => onSelect("custom")}
        >
          <span className="event-type-icon">🎉</span>
          <div>
            <strong>Custom Event</strong>
            <small>Create a public event for others to join</small>
          </div>
        </button>
        <button
          type="button"
          className="event-type-btn"
          onClick={() => onSelect("personal")}
        >
          <span className="event-type-icon">👤</span>
          <div>
            <strong>Personal Event</strong>
            <small>Private event with guest list management</small>
          </div>
        </button>
      </div>
    </div>
  </div>
);

export const CreateEventSection = ({ onNavigate }) => {
  const [showEventTypeModal, setShowEventTypeModal] = useState(true);
  const [eventType, setEventType] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // 0 = modal, 1 = form, 2 = services
  const [form, setForm] = useState({
    eventType: "",
    eventTitle: "",
    eventDescription: "",
    startDate: "",
    endDate: "",
    city: "",
    address: "",
    status: "draft",
    guestLimit: "",
    eventTime: "",
    createdAt: new Date().toISOString().split("T")[0],
    guestListFile: null, // For personal event Excel upload
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [servicesData, setServicesData] = useState(null); // Store services and vendors data
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEventTypeSelect = (type) => {
    setEventType(type);
    setForm((prev) => ({ ...prev, eventType: type }));
    setShowEventTypeModal(false);
    setCurrentStep(1); // Move to form step
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data if needed
      if (!form.eventTitle || !form.startDate || !form.city) {
        throw new Error("Please fill in all required fields");
      }

      // For personal events, validate guest list file if guest limit is not provided
      if (eventType === "personal" && !form.guestListFile && !form.guestLimit) {
        throw new Error(
          "Please either upload a guest list Excel file or provide a guest limit"
        );
      }

      // Move to the next step (services selection)
      setCurrentStep(2);

      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error in form submission:", error);
      setMessage({
        text: error.message || "Failed to proceed. Please check your inputs.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleServicesSubmit = async (servicesData) => {
    setSubmitting(true);
    setServicesData(servicesData);

    try {
      // Combine date and time for startDateTime and endDateTime
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);

      // Parse time if provided
      if (form.eventTime) {
        const [hours, minutes] = form.eventTime.split(":");
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      const startDateTime = startDate.toISOString();
      const endDateTime = endDate.toISOString();

      // Get user ID from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const userId = currentUser.id || currentUser.userId || "";

      if (eventType === "custom") {
        // Prepare Custom Event data
        const customEventData = {
          title: form.eventTitle,
          description: form.eventDescription,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          location: `${form.address}, ${form.city}`,
          eventTypeId: 1,
          serviceId: servicesData.services?.[0] || 0,
          status: form.status,
          maxAttendees: parseInt(form.guestLimit) || 0,
          isPublic: true,
          tags: [],
          imageUrl: "",
          price: 0,
          category: form.eventType || "custom",
          userId: "692bf8043e48e2edd4239dcb",
        };

        const response = await customEventsApi.create(customEventData);
        setMessage({
          text: "Custom event created successfully!",
          type: "success",
        });

        // Navigate or reset form
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      } else if (eventType === "personal") {
        // Prepare Personal Event data
        const personalEventData = {
          userId: parseInt(userId) || 0,
          title: form.eventTitle,
          description: form.eventDescription,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          location: `${form.address}, ${form.city}`,
          eventTypeId: 0, // You may need to map this
          serviceIds: servicesData.services || [],
          status: form.status,
          vendorId: servicesData.vendors
            ? Object.values(servicesData.vendors)
                .map((v) => v?.id)
                .filter(Boolean)
                .join(",")
            : "",
        };

        const response = await personalEventsApi.create(personalEventData);
        setMessage({
          text: "Personal event created successfully!",
          type: "success",
        });

        // Navigate or reset form
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage({
        text: error.message || "Failed to create event. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = () => {
    // STEP 0 → Show Modal (handled in return statement)
    if (currentStep === 0) {
      return null;
    }

    // STEP 1 → Show Event Form
    if (currentStep === 1) {
      const isPersonalEvent = eventType === "personal";

      return (
        <div className="event-form-container">
          <h2>Create {isPersonalEvent ? "Personal" : "Custom"} Event</h2>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
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
                  min={new Date().toISOString().split("T")[0]}
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
                  min={form.startDate || new Date().toISOString().split("T")[0]}
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

              {/* Guest limit - Only for custom events or as optional for personal */}
              {!isPersonalEvent && (
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
              )}

              {/* Excel Upload for Personal Events */}
              {isPersonalEvent && (
                <div className="form-group full-width">
                  <label>Upload Guest List (Excel File)</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      name="guestListFile"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleChange}
                      className="file-input"
                      id="guestListFile"
                    />
                    <label
                      htmlFor="guestListFile"
                      className="file-upload-label"
                    >
                      <span className="file-upload-icon">📄</span>
                      <span className="file-upload-text">
                        {form.guestListFile
                          ? form.guestListFile.name
                          : "Choose Excel file or drag & drop"}
                      </span>
                      {form.guestListFile && (
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setForm((prev) => ({
                              ...prev,
                              guestListFile: null,
                            }));
                            // Reset the file input
                            const fileInput =
                              document.getElementById("guestListFile");
                            if (fileInput) fileInput.value = "";
                          }}
                        >
                          ×
                        </button>
                      )}
                    </label>
                  </div>
                  <p className="file-upload-hint">
                    Upload an Excel file (.xlsx, .xls, .csv) with your guest
                    list. If not provided, you can set a guest limit below.
                  </p>
                </div>
              )}

              {/* Guest limit - Optional for personal events if no file uploaded */}
              {isPersonalEvent && (
                <div className="form-group">
                  <label>Guest Limit (Optional if file uploaded)</label>
                  <input
                    type="number"
                    name="guestLimit"
                    value={form.guestLimit}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              )}

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
                {submitting ? "Loading..." : "Save & Continue"}
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
            onSubmit={handleServicesSubmit}
          />
        </div>
      );
    }
  };

  return (
    <div className="create-event-section">
      {showEventTypeModal && currentStep === 0 && (
        <EventTypeModal
          onSelect={handleEventTypeSelect}
          onClose={() => {
            // Modal can be closed by clicking outside, but user should select an option
            // For now, we'll allow closing but could add a warning
          }}
        />
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {renderForm()}
    </div>
  );
};
