import { Request, Response, NextFunction } from 'express';

import { IUser, User } from "../models/user";
import { Image } from '../models/image';
import { IGetUserAuthInfoRequest } from '../interfaces/request';


export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const users: IUser[] = await User.find({}, "username number_of_posts avatar_image").populate("avatar_image");
    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

// Get user by name
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const user: IUser | null = await User.findOne({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
  } catch (error) {
    return next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const user: IUser | null = await User.findById({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: `User id '${req.params.user} does not exist.'` });
  } catch (error) {
    return next(error);
  }
}

// Retrieves all data about user except password
export async function getFullUser(req: any, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    console.log('full user')
    if (req.user._id !== req.params.userId) { //req.user field is added to response by passport.js authentication
      return res.status(401).send("Credentials do not match.");
    }
    const user: IUser | null = await User.findById(req.params.userId, "-password");
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
  } catch (error) {
    return next(error);
  }
}
