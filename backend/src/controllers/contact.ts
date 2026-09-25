import type { Request, Response, NextFunction } from 'express';
import { contactSchema } from '../utils/contact-schema.js';
import { ContactLead } from '../models/index.js';
import { parseUserAgent } from '../utils/user-agent.js';

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

    const userAgent = (req.get('user-agent') || '').slice(0, 500);
    const platformVer = (req.get('sec-ch-ua-platform-version') || '').slice(0, 50);
    const clientOs = (req.get('x-client-os') || '').slice(0, 50);
    const clientBrowser = (req.get('x-client-browser') || '').slice(0, 50);
    const clientDevice = (req.get('x-client-device') || '').slice(0, 50);

    const rawIp =
      req.get('x-client-ip') ||
      req.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.get('x-real-ip') ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const ip = rawIp.replace(/^::ffff:/, '');
    const { os, browser, device } = parseUserAgent(userAgent, platformVer, {
      os: clientOs,
      browser: clientBrowser,
      device: clientDevice,
    });

    await ContactLead.create({
      ...lead,
      ip,
      os,
      browser,
      device,
    });
    return res
      .status(201)
      .json({ ok: true, message: 'Thank you. Your project enquiry has been received.' });
  } catch (error) {
    next(error);
  }
}
