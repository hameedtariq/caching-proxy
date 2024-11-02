import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/api-error';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err instanceof ApiError) {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send('Internal server error');
}
