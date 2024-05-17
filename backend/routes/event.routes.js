import express from 'express';
import { createEvent, deleteEvent, getEvent, updateEvent } from '../controller/event.controller.js';

const router = express.Router()

router.post("/create-event", createEvent)
router.get("/get-event", getEvent)
router.put('/update-event/:id', updateEvent);
router.delete('/delete-event/:id', deleteEvent)



export default router