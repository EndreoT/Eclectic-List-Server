import { Request, Response, NextFunction } from 'express';
declare class Auth {
    initialize(): import("express").Handler;
    /**
     * Calls Passport's authentication strategy
     */
    private authenticate;
    /**
     * Create a JSON Web Token (JWT)
     */
    private genToken;
    validateJWT(req: Request, res: Response, next: NextFunction): any;
    /**
     * Validates that the user id in res.locals.userIdLocation is equal to the user id provided in their JWT
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    authorizeUser(req: Request, res: Response, next: NextFunction): any;
    /**
     *  Signup authentication
     * @param {*} req
     * @param {*} res
     */
    signup: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
    /**
     * Initializes Passport strategy
     */
    private getStrategy;
}
export declare const auth: Auth;
export {};
