import type { Request, Response, NextFunction } from 'express';
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const err = error as { status?: number; type?: string; name?: string; publicMessage?: string };
  const status =
    err.type === 'entity.parse.failed'
      ? 400
      : err.type === 'entity.too.large'
        ? 413
        : err.status === 422
          ? 422
          : err.status === 503 || err.name?.includes('Mongo') || err.name?.includes('Mongoose')
            ? 503
            : 500;
  // Never log payloads, connection strings or personal data.
  if (status >= 500) console.error('API request failed', { type: err.name || 'Error', status });
  res.status(status).json({
    ok: false,
    message:
      status === 422
        ? err.publicMessage || 'Invalid input.'
        : status === 400
          ? 'Invalid JSON request.'
          : status === 413
            ? 'Request is too large.'
            : 'Enquiries are temporarily unavailable. Please try again later.',
  });
}
