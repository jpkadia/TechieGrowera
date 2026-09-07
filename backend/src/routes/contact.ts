import { Router } from 'express';
import { authenticateProxy, persistentRateLimit } from '../middleware/security.js';
import { createContact } from '../controllers/contact.js';
export const contactRouter = Router();
contactRouter.post('/', authenticateProxy, persistentRateLimit, createContact);
