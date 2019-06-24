import { Request, Response, NextFunction } from 'express';
declare class Auth {
    constructor();
    private authenticate;
    validateJWT: (req: Request, res: Response, next: NextFunction) => void;
    private genToken;
    signup: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    private getStrategy;
}
export declare const auth: Auth;
export {};
