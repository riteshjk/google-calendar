import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Make sure to set the app root element for accessibility

const EventActionsPopup = ({
  event,
  onClose,
  onEventUpdated,
  onEventDeleted,
  user,
}) => {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    participants: event.participants ? event.participants.join(", ") : "",
    sessionNotes: event.sessionNotes,
  });

  console.log(formData,"hahahaha")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const participantsArray = formData.participants
        .split(",")
        .map((participant) => participant.trim());

      await axios.put(
        `http://localhost:3000/auth/update-event/${event.id}`,
        {
          ...formData,
          participants: participantsArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
        }
      );

      onEventUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  

  const handleDeleteEvent = async () => {
    
    try {
      await axios.delete(
        `http://localhost:3000/auth/delete-event/${event.id}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      onEventDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  console.log(event,'event')
  return (
    <Modal
      isOpen={!!event}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h3>Edit Event</h3>
      <form onSubmit={handleUpdateEvent}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Participants (comma-separated emails):</label>
          <input
            type="text"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Session Notes:</label>
          <textarea
            name="sessionNotes"
            value={formData.sessionNotes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Update Event</button>
      </form>
      <button type="button" onClick={handleDeleteEvent}>
        Delete
      </button>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

export default EventActionsPopup;