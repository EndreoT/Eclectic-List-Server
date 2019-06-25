import { Request, Response, NextFunction } from 'express';
export declare function sanitizePost(req: Request, res: Response, next: NextFunction): void;
export declare function sanitizeComment(req: Request, res: Response, next: NextFunction): void;
export declare function sanitizeUser(req: Request, res: Response, next: NextFunction): void;
