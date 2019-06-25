import { sanitizeBody } from "express-validator/filter";
import { Request, Response, NextFunction } from 'express';

import { ICategory, Category } from "../models/category";
import { IImage, Image } from '../models/image';
import { IPost, Post } from "../models/post";
import { IUser, User } from "../models/user";
import * as validation from "../validation/validation";
import { ValidationError } from "joi";


interface IPostBody {
  subject: string;
  description: string;
  price: number;
  category: string;
  userId?: string;
  user?: string;
}


export async function getAllPosts(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const posts: IPost[] = await Post.find().sort('-createdAt').populate("user", "username").populate("category");
    return res.json(posts);
  } catch (error) {
    return res.status(404).json({ message: `No posts exist.` });
    // return next(error);
  }
};

export async function getPost(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const post: IPost | null = await Post.findById(req.params.post).populate("user", "username avatar_image").populate("category");
    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ message: `Post id '${req.params.post} does not exist.'` });
    // return next(error);
  }
};

export async function getPostsByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const user: IUser | null = await User.findOne({ username: req.params.user });
    if (user) {
      const posts: IPost[] = await Post.find({ user: user._id }).populate("category");
      return res.json(posts);
    }
    return res.status(404).json({ message: `User '${req.params.user}' does not exist.` });
  } catch (error) {
    return next(error);
  }
};

export async function getPostsByCategory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const category: ICategory | null = await Category.findOne({ category: req.params.category });
    if (category) {
      const posts: IPost[] = await Post.find({ category: category._id }).populate("user", "username");
      return res.json(posts);
    }
    return res.status(404).json({ message: `Category '${req.params.category}' does not exist.` });
  } catch (error) {
    return next(error);
  }
}

//NEED TO Handle HTML chars
export async function createPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { error }: { error: ValidationError } = validation.validatePost(req.body);
  if (error) {
    return res.status(400).json(error.details[0]);
  }
  try {
    const [user, category] = await Promise.all(
      [User.findById(req.body.userId), Category.findOne({ category: req.body.category })]
    );
    if (!user || !category) {
      return res.json({ message: `User with id ${req.body.userId} does not exist.` });
    }
    const postCreateBody: IPostBody = {
      subject: req.body.subject,
      description: req.body.description,
      price: req.body.price,
      category: category._id,
      user: user._id,
    };
    const post: IPost = new Post(postCreateBody);
    const savedPost: IPost = await post.save();
    await Promise.all(
      [
        User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: 1 } }),
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } })
      ]
    );
    return res.json(savedPost);
  } catch (error) {
    return next(error);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { error } = validation.validatePost(req.body);
  if (error) {
    return res.status(400).json(error.details[0]);
  }
  try {
    const [category, originalPost] = await Promise.all(
      [Category.findOne({ category: req.body.category }), Post.findById(req.params.id)]
    );
    if (!originalPost || !category) {
      return res.json({ message: `Post with id ${req.params.id} does not exist.` });
    }
    if (category._id !== originalPost.category) { //Updates number of posts for category
      await Promise.all([
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
        Category.findByIdAndUpdate(originalPost.category, { $inc: { number_of_posts: -1 } }),
      ]);
    }
    const postUpdateBody: IPostBody = {
      subject: req.body.subject,
      description: req.body.description,
      price: req.body.price,
      category: category._id,
    }
    const post = await Post.findByIdAndUpdate(req.params.id,
      {
        $set: postUpdateBody,
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "That post ID was not found." });
    }
    return res.send(post);
  } catch (error) {
    return next(error);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const post: IPost | null = await Post.findById(req.params.id);
    if (!post) {
      return res.json({ message: `Post with id ${req.params.id} does not exist.` });
    }
    const [user, category] = await Promise.all(
      [User.findById(post.user), Category.findById(post.category)]
    );
    if (!user || !category) {
      return res.json({ message: `User with id ${post.user} does not exist.` });
    }
    // Delete post and update number of posts for user and category
    const [deletedPost] = await Promise.all(
      [
        Post.findByIdAndDelete(req.params.id),
        User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: -1 } }),
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: -1 } }),
        Image.deleteMany({ post: post._id }),
      ]
    );
    return res.send(deletedPost);
  } catch (error) {
    return res.status(404).json({ message: `Post id '${req.params.id} does not exist.'` });
  }
}
