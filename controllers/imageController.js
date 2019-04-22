// Images stored on Cloudinary 

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Image = require('../models/image');
const User = require('../models/user');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Choose directory for saving images in Cloudinary
function chooseImageDir(imageDir) {
    return cloudinaryStorage({
        cloudinary: cloudinary,
        folder: imageDir,
        allowedFormats: ["jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    })
}

// Handle image uploads for avatar images and post images
function postImage(parser, folder) {
    return [
        function (req, res, next) {
            // Parse and upload image in Cloudinary
            parser.single("file")(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log('multerError', err)
                } else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Unknown Error', err)
                } else {
                    next();
                }
            });
        },
        async (req, res, next) => {
            // Save image in mongoDB
            const image = {};
            image.path = req.file.secure_url;
            image.public_id = req.file.public_id;
            image.folder = folder;
            image.caption = '';
            try {
                const savedImage = await Image.create(image);
                return res.json(savedImage);
            } catch (error) {
                console.log("Error in saving image document", error);
            }
            return res.json()
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
exports.postAvatarImage = postImage(avatarImageParser, folders.avatarImageFolder);

exports.postPostImage = postImage(postImageParser, folders.postImageFolder);

// Handle multiple image uploads
exports.postMultipleImages = postMultipleImages(postImageParser, folders.postImageFolder);

function postMultipleImages(parser, folder) {
    return [
        function (req, res, next) {
             // Parse and upload images in Cloudinary
            parser.array("file", 10)(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log('multerError', err)
                } else if (err) {
                    // An unknown error occurred when uploading.
                    console.log('Unknown Error', err)
                } else {
                    next();
                }
            });
        },
        async (req, res, next) => {
            // Save images in mongoDB
            const imageIds = [];
            await asyncForEach(req.files, async (item) => {
                const image = {};
                image.path = item.secure_url;
                image.public_id = item.public_id;
                image.folder = folder;
                image.caption = '';
                image.post = req.params.postId;
                try {
                    const savedImage = await Image.create(image);
                    imageIds.push(savedImage._id)
                } catch (error) {
                    console.log("Error in saving image document", error);
                }
            });
            return res.json(imageIds);
        }
    ];
}

// Returns url string to access Cloudinary image using GET request
exports.getImageById = async (req, res, next) => {
    try {
        const result = await Image.findById(req.params.imageId);
        res.json(result);
    } catch (error) {
        return res.status(404).json({ message: `Avatar image id '${req.params.imageId}' does not exist` });
        // return next(error)
    }
}

exports.getAllImages = async (req, res, next) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        return res.status(404).json({ message: `No images exist.` });
    }
}

exports.getAllAvatarImages = async (req, res, next) => {
    try {
        const avatarImages = await Image.find({ folder: 'avatar' });
        res.json(avatarImages);
    } catch (error) {
        return res.status(404).json({ message: `No avatar images exist.` });
    }
}

exports.getImagesForPost = async (req, res, next) => {
    try {
        const postImages = await Image.find({ post: req.params.postId });
        res.json(postImages);
    } catch (error) {
        return res.status(404).json({ message: `No post images exist for post ${req.params.postId}.` });
    }
}

exports.setUserAvatarImage = async (req, res, next) => {
    try {
        const avatarImage = await Image.findById(req.body.imageId);
        const user = await User.findByIdAndUpdate(req.body.userId,
            { $set: { avatar_image: avatarImage._id } },
            { 'fields': "username number_of_posts avatar_image", 'new': true })
            .populate("avatar_image");
        console.log(user)
        return res.json({ image: avatarImage, user: user });
    } catch (error) {
        return res.status(404).json({ message: `Error in setting user avatar image` });
    }
}
