// // Images stored on Cloudinary 

import {Request, Response, NextFunction} from 'express';
import * as multer from "multer";
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

import {IImage, Image} from '../models/image';
import {User} from '../models/user';

async function asyncForEach<T>(array: T[], callback: any): Promise<void> {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Choose directory for saving images in Cloudinary
function chooseImageDir(imageDir: string) {
    return cloudinaryStorage({
        cloudinary,
        folder: imageDir,
        allowedFormats: ["jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    })
}

// Handle image uploads for avatar images and post images
function postImage(parser: multer.Instance, folder: string) {
    return [
        (req: Request, res: Response, next: NextFunction) => {
            // Parse and upload image in Cloudinary
            parser.single("file")(req, res, (err) => {
                if (err) {
                    console.log('Error', err);
                } else {
                    next();
                }
            });
        },
        async (req: any, res: Response, next: NextFunction) => {
            // Save image in mongoDB
            const image = {
                path: req.file.secure_url,
                public_id: req.file.public_id,
                folder,
                caption: '',
            };
           
            try {
                const savedImage = await Image.create(image);
                return res.json(savedImage);
            } catch (error) {
                console.log("Error in saving image document", error);
            }
            return res.json();
        }
    ];
}

// Image folders
const folders = {
    avatarImageFolder: 'avatar',
    postImageFolder: 'postImage'
}

const avatarImageParser = multer({ storage: chooseImageDir(folders.avatarImageFolder) });
const postImageParser = multer({ storage: chooseImageDir(folders.postImageFolder) });

// Handle single image uploads
export const postAvatarImage = postImage(avatarImageParser, folders.avatarImageFolder);

export const postPostImage = postImage(postImageParser, folders.postImageFolder);

// Handle multiple image uploads
export const postMultipleImages = postMultipleImagesHelper(postImageParser, folders.postImageFolder);

function postMultipleImagesHelper(parser: multer.Instance, folder: string) {
    return [
        (req: Request, res: Response, next: NextFunction) => {
             // Parse and upload images in Cloudinary
            parser.array("file", 10)(req, res, function (err) {
                if (err ) {
                    // A Multer error occurred when uploading.
                    console.log('multerError', err)
                } else {
                    next();
                }
            });
        },
        async  (req: any, res: Response, next: NextFunction) => {
            // Save images in mongoDB
            const imageIds: IImage[] = [];
            await asyncForEach(req.files, async (item: any) => {
                const image: {path: string, public_id: string, folder: string, caption: string, post: string} = {
                    path: item.secure_url,
                    public_id: item.public_id,
                    folder,
                    caption: '',
                    post: req.params.postId,
                };
              
                try {
                    const savedImage: IImage = await Image.create(image);
                    imageIds.push(savedImage._id);
                } catch (error) {
                    console.log("Error in saving image document", error);
                }
            });
            return res.json(imageIds);
        }
    ];
}

// Returns url string to access Cloudinary image using GET request
export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Image.findById(req.params.imageId);
        return res.json(result);
    } catch (error) {
        return res.status(404).json({ message: `Avatar image id '${req.params.imageId}' does not exist` });
        // return next(error)
    }
}

export async function getAllImages (req: Request, res: Response, next: NextFunction) {
    try {
        const images = await Image.find();
        return res.json(images);
    } catch (error) {
        return res.status(404).json({ message: `No images exist.` });
    }
}

export async function getAllAvatarImages (req: Request, res: Response, next: NextFunction) {
    try {
        const avatarImages = await Image.find({ folder: 'avatar' });
        return res.json(avatarImages);
    } catch (error) {
        return res.status(404).json({ message: `No avatar images exist.` });
    }
}

export async function getImagesForPost (req: Request, res: Response, next: NextFunction) {
    try {
        const postImages = await Image.find({ post: req.params.postId });
        return res.json(postImages);
    } catch (error) {
        return res.status(404).json({ message: `No post images exist for post ${req.params.postId}.` });
    }
}

export async function setUserAvatarImage (req: Request, res: Response, next: NextFunction) {
    try {
        const avatarImage: IImage | null = await Image.findById(req.body.imageId);
        if (!avatarImage) {
            return res.status(404).json({ message: `Error in setting user avatar image` });
        }
        const user = await User.findByIdAndUpdate(req.body.userId,
            { $set: { avatar_image: avatarImage._id } },
            { 'fields': "username number_of_posts avatar_image", 'new': true })
            .populate("avatar_image");
        console.log(user)
        return res.json({ image: avatarImage, user });
    } catch (error) {
        return res.status(404).json({ message: `Error in setting user avatar image` });
    }
}
