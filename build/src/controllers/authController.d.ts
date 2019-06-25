import { Request, Response, NextFunction } from 'express';
declare class Auth {
    initialize(): import("express").Handler;
    private authenticate;
    validateJWT: (req: Request, res: Response, next: NextFunction) => any;
    private authorizeUser;
    authorizeUserBody: (req: Request, res: Response, next: NextFunction) => any;
    authorizeUserParams: (req: Request, res: Response, next: NextFunction) => any;
    private genToken;
    signup: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    private getStrategy;
}
export declare const auth: Auth;
export {};
