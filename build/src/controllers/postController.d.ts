import { Request, Response, NextFunction } from 'express';
export declare function getAllPosts(req: Request, res: Response, next: NextFunction): Promise<Response>;
export declare function getPost(req: Request, res: Response, next: NextFunction): Promise<Response>;
export declare function getPostsByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getPostsByCategory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function createPost(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function updatePost(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function deletePost(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
