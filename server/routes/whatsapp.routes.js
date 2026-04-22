import express from 'express';
import { saveLead } from '../controllers/whatsapp.controller.js';

const router = express.Router();

router.post('/', saveLead);

export default router;
