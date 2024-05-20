// src/component/CreateEvent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import moment from 'moment';

Modal.setAppElement('#root');

const CreateEvent = ({ isOpen, onRequestClose, selectedDate, onEventCreated, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    participants: '',
    date: '',
    starttime: '',
    endtime: '',
    sessionNotes: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData({
        ...formData,
        date: moment(selectedDate).format('YYYY-MM-DD')
      });
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const participantsArray = formData.participants.split(',').map(participant => participant.trim());

    try {
      const response = await axios.post('https://calendar-backend-fhh9.onrender.com/auth/create-event', {
        ...formData,
        participants: participantsArray
      }, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      console.log(response.data);
      alert('Event created successfully');
      onRequestClose(); // Close modal after successful submission
      onEventCreated(); // Notify parent component to refresh events
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit} className="form">
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
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            name="starttime"
            value={formData.starttime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            name="endtime"
            value={formData.endtime}
            onChange={handleChange}
            required
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
        <button type="submit" className="btn">Create Event</button>
      </form>
      <button onClick={onRequestClose} className="btn close-btn">Close</button>
    </Modal>
  );
};

export default CreateEvent;