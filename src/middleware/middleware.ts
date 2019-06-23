import { Request, Response, NextFunction } from 'express';

import { sanitizeBody } from "express-validator/filter";


export function sanitizePost(req: Request, res: Response, next: NextFunction): void {
  sanitizeBody("subject").trim().escape();
  sanitizeBody("description").trim().escape();
  sanitizeBody("price").toFloat().trim().escape();
  return next();
}

export function sanitizeComment(req: Request, res: Response, next: NextFunction): void {
  sanitizeBody("comment").trim().escape();
  next();
}
