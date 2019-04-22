var path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')})

const mongoose = require("mongoose");

const categories = require("../constants/categoriesConstants");
const Category = require("../models/category");
const Image = require('../models/image');
const Post = require("../models/post");
const User = require("../models/user");


const mongoDB = process.env.MONGODB_URI || process.env.mLabDB;
// const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;


mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => "You are now connected to Mongo!")
    .catch(err => console.error("Something went wrong!", err));
   
async function addAvatarImageToUser() {
    await User.findByIdAndUpdate(
        // "5c7f4b447de5bd03bca24917", //McFluffy
        "5c7f4b457de5bd03bca24918", // Gavin
        {
            $set: {
                // avatar_image: "5c8f1d49bbb02206ccfe0f8e"
                avatar_image: "5c91aea8ca394c21fc956e75"
            }
        }, 
        {new: true}
    );
    mongoose.connection.close();
}    
// addAvatarImageToUser()

async function deleteAllNonAvatarImages() {
    await Image.deleteMany({folder: 'postImage'})
    mongoose.connection.close();
}
// deleteAllNonAvatarImages();

async function addCaptionToImage(caption, imageId) {
    await Image.findByIdAndUpdate(
        imageId,
        {
            $set: {
                caption: caption
            }
        }, 
        {new: true}
    );
    mongoose.connection.close();
}    
// addCaptionToImage('default', '5c9454f285adca33447018c6');

