import { Request, Response, NextFunction } from 'express';

import { ICategory, Category } from "../models/category";
import { Image } from '../models/image';
import { IPost, Post } from "../models/post";
import { IUser, User } from "../models/user";
import * as validation from "../validation/validation";
import { ValidationError } from "joi";


// interface IPostBody {
//   subject: string;
//   description: string;
//   price: number;
//   category: string;
//   userId?: string;
//   user?: string;
// }


export async function getAllPosts(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const posts: IPost[] = await Post.find().sort('-createdAt').populate("user", "username").populate("category");
    return res.json(posts);
  } catch (error) {
    return res.status(404).json({ message: `No posts exist.` });
    // return next(error);
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const post: IPost | null = await Post.findById(req.params.postId).populate("user", "username avatar_image").populate("category");
    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ message: `Post id '${req.params.post} does not exist.'` });
    // return next(error);
  }
}

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
}

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
    const category: ICategory | null = await Category.findOne({ category: req.body.category });

    if (!category) {
      return res.json({ message: 'Category does not exist.' });
    }

    const authenticatedUser: any = res.locals.authenticatedUser;

    const postCreateBody = {
      subject: req.body.subject,
      description: req.body.description,
      price: req.body.price,
      category: category._id,
      user: authenticatedUser._id,
    };
    const post: IPost = new Post(postCreateBody);
    const savedPost: IPost = await post.save();
    await Promise.all(
      [
        User.findByIdAndUpdate(authenticatedUser._id, { $inc: { number_of_posts: 1 } }),
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
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
    const postId: string = req.params.postId;
    const [category, originalPost] = await Promise.all(
      [Category.findOne({ category: req.body.category }), Post.findById(postId)]
    );
    if (!originalPost) {
      return res.json({ message: `Post with id ${postId} does not exist.` });
    }

    if (!category) {
      return res.json({ message: 'Category does not exist.' });
    }

    const authenticatedUser: any = res.locals.authenticatedUser;

    if (authenticatedUser._id.toString() !== originalPost.user.toString()) {
      return res.status(422).json({ message: 'You are not authorized to perform this action' });
    }

    if (category._id !== originalPost.category) { //Updates number of posts for category
      await Promise.all([
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
        Category.findByIdAndUpdate(originalPost.category, { $inc: { number_of_posts: -1 } }),
      ]);
    }
    const postUpdateBody = {
      subject: req.body.subject,
      description: req.body.description,
      price: req.body.price,
      category: category._id,
      user: authenticatedUser._id.toString(),
    };
    const post = await Post.findByIdAndUpdate(postId,
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
    const postId: string = req.params.postId;
    const post: IPost | null = await Post.findById(postId);

    if (!post) {
      return res.json({ message: `Post with id ${postId} does not exist.` });
    }

    const authenticatedUser: any = res.locals.authenticatedUser;

    if (authenticatedUser._id.toString() !== post.user.toString()) {
      return res.status(422).json({ message: 'You are not authorized to perform this action' });
    }

    const category: ICategory | null = await Category.findById(post.category);

    if (!category) {
      return res.status(404).json({ message: 'Category does not exist' });
    }

    // Delete post and update number of posts for user and category
    const [deletedPost] = await Promise.all(
      [
        Post.findByIdAndDelete(postId),
        User.findByIdAndUpdate(authenticatedUser._id, { $inc: { number_of_posts: -1 } }),
        Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: -1 } }),
        Image.deleteMany({ post: post._id }),
      ]
    );
    return res.send(deletedPost);
  } catch (error) {
    return res.status(404).json({ message: `Post id '${req.params.postId} does not exist.'` });
  }
}
