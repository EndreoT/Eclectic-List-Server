import { Request, Response, NextFunction } from 'express';

import { IComment, Comment } from "../models/comment";
import { IPost, Post } from "../models/post";
import * as validation from "../validation/validation";


export async function getAllComments(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const comments: IComment[] = await Comment.find().sort({ createdAt: 1 });
    if (comments) return res.send(comments);
    return res.status(404).json({ message: `No comments exist.` });
  } catch (error) {
    return next(error);
  }
}

// Get comment by id
export async function getCommentById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const comment: IComment | null = await Comment.findById(req.params.commentId);
    return res.json(comment);
  } catch (error) {
    return res.status(404).json({ message: `Comment id '${req.params.commentId}' does not exist` });
    // return next(error); 
  }
}

// Get all comments for post id
export async function getCommentsForPost(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const comments: IComment[] = await Comment
      .find({ post: req.params.postId }).sort({ createdAt: 1 })
      .populate({ path: "user", select: "username", populate: { path: "avatar_image" } });
    return res.send(comments);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: `Post '${req.params.postId}' does not exist.` });
    }
    return next(error);
  }
}

// Creates comment for a given post and user
// TODO: NEED TO Handle HTML chars
export async function createComment(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  const authenticatedUser: any = res.locals.authenticatedUser;

  const { error } = validation.validateComment(req.body);
  if (error) {
    return res.status(400).json(error.details[0]);
  }

  try {
    const post: IPost | null = await Post.findById(req.body.postId);
    if (!post) {
      return res.json({ message: `Post with id ${req.body.postId} does not exist.` });
    }
    const comment: IComment = new Comment(
      {
        comment: req.body.comment,
        post: post._id,
        user: authenticatedUser._id,
      }
    );
    const savedComment: IComment = await comment.save();

    // Update number of comments for post and return new comment
    const [populatedComment] = await Promise.all(
      [
        Comment.findById(savedComment._id).populate({ path: "user", select: "username", populate: { path: "avatar_image" } }),
        Post.findByIdAndUpdate(post._id, { $inc: { number_of_comments: 1 } }, { new: true }),
      ]
    );
    return res.json(populatedComment);
  } catch (error) {
    return next(error);
  }
}

