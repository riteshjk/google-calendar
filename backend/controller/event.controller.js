import { google } from "googleapis";
import Event from "../models/event.js";
import { createGoogleCalendarEvent } from "./Oauth.controller.js";
import { OAuth2Client } from "google-auth-library";





const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const createEvent = async (req, res) => {
  const { title, description, participants, date, starttime, endtime, sessionNotes, googleEventId } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  if (!title || !date || !starttime || !endtime) {
    return res.status(400).json({ message: "Title, date, start time, and end time are required." });
  }

  try {
    const start = new Date(`${date}T${starttime}:00`);
    const end = new Date(`${date}T${endtime}:00`);

    const newEvent = new Event({
      title,
      description,
      participants,
      start,
      end,
      sessionNotes,
      googleEventId
    });

    await newEvent.save();

    // Set the credentials for the Google Calendar API
    oAuth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // Create the event on Google Calendar
    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'UTC', // Adjust the time zone as needed
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'UTC', // Adjust the time zone as needed
      },
      attendees: participants.map(email => ({ email })), // Assuming participants is an array of email addresses
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Reminder 1 day before
          { method: 'popup', minutes: 10 },      // Reminder 10 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    // Update the event in the database with the Google Calendar event ID
    newEvent.googleEventId = response.data.id;
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
  export const getEvent = async (req, res) => {
    const { title } = req.query;
  
    try {
      const query = title ? { title: new RegExp(title, 'i') } : {};
      const events = await Event.find(query);
      console.log(events,"ababab")
      const formattedEvents = events.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        participants: event.participants,
        start: event.start,
        end: event.end,
        sessionNotes: event.sessionNotes,
        googleEventId: event.googleEventId
      }));
  
      res.status(200).json(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { title, description, participants, date, starttime, endtime, sessionNotes } = req.body;
    const token = req.headers.authorization.split(" ")[1];
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      event.title = title;
      event.description = description;
      event.participants = participants;
      event.sessionNotes = sessionNotes;
      await event.save();
  
      oAuth2Client.setCredentials({ access_token: token });
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  
      const updatedEvent = {
        summary: title,
        description: description,
        start: {
          dateTime: event.start,
          timeZone: "UTC",
        },
        end: {
          dateTime: event.end,
          timeZone: "UTC",
        },
        attendees: participants.map(email => ({ email })),
      };
  
      await calendar.events.update({
        calendarId: "primary",
        eventId: event.googleEventId,
        resource: updatedEvent,
      });
  
      res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
  console.log(token,"token")
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      oAuth2Client.setCredentials({ access_token: token });
      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      
      await calendar.events.delete({
        calendarId: "primary",
        eventId: event.googleEventId,
      });
  
      await Event.findByIdAndDelete(eventId);
  
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };