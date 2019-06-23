import { Request, Response, NextFunction } from 'express';
export declare function getAllPosts(req: Request, res: Response, next: NextFunction): Promise<Response>;
export declare function getPost(req: Request, res: Response, next: NextFunction): Promise<Response>;
