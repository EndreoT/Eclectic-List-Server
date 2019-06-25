import { Request, Response, NextFunction } from 'express';
export declare const postAvatarImage: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const postPostImage: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const postMultipleImages: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const getImageById: (req: Request, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
export declare function getAllImages(req: Request, res: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
export declare function getAllAvatarImages(req: Request, res: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
export declare function getImagesForPost(req: Request, res: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
export declare function setUserAvatarImage(req: Request, res: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
