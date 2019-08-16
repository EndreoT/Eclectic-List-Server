import { Request, Response, NextFunction } from 'express';
export declare function getAllComments(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
export declare function getCommentById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
export declare function getCommentsForPost(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
export declare function createComment(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
