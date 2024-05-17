import express from 'express';
import { createEvent, getEvent } from '../controller/event.controller.js';

const router = express.Router()

router.post("/create-event", createEvent)
router.get("/get-event", getEvent)


export default router