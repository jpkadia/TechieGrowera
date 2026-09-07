import type { Request, Response, NextFunction } from 'express';
import { contactSchema } from '../utils/contact-schema.js';
import { ContactLead } from '../models/index.js';
export async function createContact(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(422).json({
        ok: false,
        message: 'Please check the form fields.',
        errors: parsed.error.flatten().fieldErrors,
      });
    const { website, startedAt, ...lead } = parsed.data;
    const elapsed = Date.now() - startedAt;
    if (website || elapsed < 2500 || elapsed > 24 * 60 * 60 * 1000)
      return res.status(422).json({ ok: false, message: 'Please refresh the form and try again.' });
    await ContactLead.create(lead);
    return res
      .status(201)
      .json({ ok: true, message: 'Thank you. Your project enquiry has been received.' });
  } catch (error) {
    next(error);
  }
}
