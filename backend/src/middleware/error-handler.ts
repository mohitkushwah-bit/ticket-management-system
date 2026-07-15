import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: Array<{ message: string; field?: string; code?: string }> = [],
  ) {
    super(message);
    this.name = 'AppError';
    if (errors.length === 0) {
      this.errors = [{ message }];
    }
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: err.errors });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    errors: [{ message: 'Internal server error' }],
  });
}
