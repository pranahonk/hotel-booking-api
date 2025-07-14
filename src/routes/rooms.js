import express from 'express';
import { getAllRooms, getRoom, checkAvailability } from '../controllers/roomController.js';

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/availability', checkAvailability);
router.get('/:id', getRoom);

export default router;
