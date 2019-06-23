import { Request, Response, NextFunction } from 'express';

import { sanitizeBody } from "express-validator/filter";


export function sanitizePost(req: Request, res: Response, next: NextFunction) {
  sanitizeBody("subject").trim().escape();
  sanitizeBody("description").trim().escape();
  sanitizeBody("price").toFloat().trim().escape();
  next();
}