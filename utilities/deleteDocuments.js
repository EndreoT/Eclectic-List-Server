var path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')})

const mongoose = require("mongoose");

const Category = require("../models/category");
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

const mongoDB = process.env.MONGODB_URI || process.env.mLabDB;
// const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => "You are now connected to Mongo!")
    .catch(err => console.error("Something went wrong!", err));


async function deleteDocumentTypes(modelType) {
    result = await modelType.find().deleteMany();
    mongoose.connection.close();
}


// deleteDocumentTypes(Comment);
// deleteDocumentTypes(Post);
// deleteDocumentTypes(Category);
// deleteDocumentTypes(User);
