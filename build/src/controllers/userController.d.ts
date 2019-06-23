import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../interfaces/request';
export declare function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
export declare function getFullUser(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<Response | void>;
