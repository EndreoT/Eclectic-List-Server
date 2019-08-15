"use strict";
// // Images stored on Cloudinary 
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const image_1 = require("../models/image");
const user_1 = require("../models/user");
async function asyncForEach(array, callback) {
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
function chooseImageDir(imageDir) {
    return cloudinaryStorage({
        cloudinary,
        folder: imageDir,
        allowedFormats: ["jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
}
// Handle image uploads for avatar images and post images
function postImage(parser, folder) {
    return [
        (req, res, next) => {
            // Parse and upload image in Cloudinary
            parser.single("file")(req, res, (err) => {
                if (err) {
                    console.log('Error', err);
                }
                else {
                    next();
                }
            });
        },
        async (req, res, next) => {
            // Save image in mongoDB
            const image = {
                path: req.file.secure_url,
                public_id: req.file.public_id,
                folder,
                caption: '',
            };
            try {
                const savedImage = await image_1.Image.create(image);
                return res.json(savedImage);
            }
            catch (error) {
                console.log("Error in saving image document", error);
            }
            return res.json();
        },
    ];
}
// Image folders
const folders = {
    avatarImageFolder: 'avatar',
    postImageFolder: 'postImage',
};
const avatarImageParser = multer({ storage: chooseImageDir(folders.avatarImageFolder) });
const postImageParser = multer({ storage: chooseImageDir(folders.postImageFolder) });
// Handle single image uploads
exports.postAvatarImage = postImage(avatarImageParser, folders.avatarImageFolder);
exports.postPostImage = postImage(postImageParser, folders.postImageFolder);
// Handle multiple image uploads
exports.postMultipleImages = postMultipleImagesHelper(postImageParser, folders.postImageFolder);
function postMultipleImagesHelper(parser, folder) {
    return [
        (req, res, next) => {
            // Parse and upload images in Cloudinary
            parser.array("file", 10)(req, res, function (err) {
                if (err) {
                    // A Multer error occurred when uploading.
                    console.log('multerError', err);
                }
                else {
                    next();
                }
            });
        },
        async (req, res, next) => {
            // Save images in mongoDB
            const imageIds = [];
            await asyncForEach(req.files, async (item) => {
                const image = {
                    path: item.secure_url,
                    public_id: item.public_id,
                    folder,
                    caption: '',
                    post: req.params.postId,
                };
                try {
                    const savedImage = await image_1.Image.create(image);
                    imageIds.push(savedImage._id);
                }
                catch (error) {
                    console.log("Error in saving image document", error);
                }
            });
            return res.json(imageIds);
        },
    ];
}
// Returns url string to access Cloudinary image using GET request
exports.getImageById = async (req, res, next) => {
    try {
        const result = await image_1.Image.findById(req.params.imageId);
        return res.json(result);
    }
    catch (error) {
        return res.status(404).json({ message: `Avatar image id '${req.params.imageId}' does not exist` });
        // return next(error)
    }
};
async function getAllImages(req, res, next) {
    try {
        const images = await image_1.Image.find();
        return res.json(images);
    }
    catch (error) {
        return res.status(404).json({ message: `No images exist.` });
    }
}
exports.getAllImages = getAllImages;
async function getAllAvatarImages(req, res, next) {
    try {
        const avatarImages = await image_1.Image.find({ folder: 'avatar' });
        return res.json(avatarImages);
    }
    catch (error) {
        return res.status(404).json({ message: `No avatar images exist.` });
    }
}
exports.getAllAvatarImages = getAllAvatarImages;
async function getImagesForPost(req, res, next) {
    try {
        const postImages = await image_1.Image.find({ post: req.params.postId });
        return res.json(postImages);
    }
    catch (error) {
        return res.status(404).json({ message: `No post images exist for post ${req.params.postId}.` });
    }
}
exports.getImagesForPost = getImagesForPost;
async function setUserAvatarImage(req, res, next) {
    try {
        const avatarImage = await image_1.Image.findById(req.body.imageId);
        if (!avatarImage) {
            return res.status(404).json({ message: `Error in setting user avatar image` });
        }
        const user = await user_1.User.findByIdAndUpdate(req.body.userId, { $set: { avatar_image: avatarImage._id } }, { 'fields': "username number_of_posts avatar_image", 'new': true })
            .populate("avatar_image");
        console.log(user);
        return res.json({ image: avatarImage, user });
    }
    catch (error) {
        return res.status(404).json({ message: `Error in setting user avatar image` });
    }
}
exports.setUserAvatarImage = setUserAvatarImage;
//# sourceMappingURL=imageController.js.map