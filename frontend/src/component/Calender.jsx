// src/component/Calender.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import CreateEvent from './CreateEvent';
import EventActionsPopup from './EventActionsPopup';

const localizer = momentLocalizer(moment);

const MyCalendar = ({  accessToken }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  console.log(accessToken,'acessToken')


  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://calendar-backend-fhh9.onrender.com/auth/get-event', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const fetchedEvents = response.data.map(event => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        desc: event.description,
        participants: event.participants,
        id: event.id,
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true);
  };

  const handleEventCreated = () => {
    fetchEvents();
  };

  const handleEventDeleted = () => {
    fetchEvents();
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        selectable
        onSelectSlot={handleDateClick}
        onSelectEvent={handleEventClick}
      />
      <CreateEvent
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onEventCreated={handleEventCreated}
        user={accessToken}
      />

      {selectedEvent && (
        <EventActionsPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventDeleted={handleEventDeleted}
          onEventUpdated={fetchEvents}
          user={accessToken}
        />
      )}
    </div>
  );
};

export default MyCalendar;