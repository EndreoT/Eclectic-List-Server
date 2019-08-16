import { Request, Response, NextFunction } from 'express';
export declare function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getFullUser(req: any, res: Response, next: NextFunction): Promise<Response | void>;
