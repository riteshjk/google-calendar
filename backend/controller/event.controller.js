import Event from "../models/event.js";

export const createEvent = async (req, res) => {
    const { title, description, participants, date, starttime, endtime, sessionNotes, googleEventId } = req.body;

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
      console.log(newEvent)

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
    const { id } = req.params; 
    const { title, description, participants, start, end, sessionNotes, googleEventId } = req.body;
  
    try {
      const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, participants, start, end, sessionNotes }, { new: true });
      res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const deleteEvent = async (req, res) => {
    const { id } = req.params; 
  
    try {
      await Event.findByIdAndDelete(id);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  