var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const mongoose = require("mongoose");

const categories = require("../constants/categoriesConstants");
const Category = require("../models/category");
const Post = require("../models/post");
const User = require("../models/user");


const mongoDB = process.env.MONGODB_URI || process.env.mLabDB;
// const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => "You are now connected to Mongo!")
    .catch(err => console.error("Something went wrong!", err));


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
};

async function createCategoryDocuments() {
    await asyncForEach(Array.from(categories), async (item) => {
        const possibleExistingCategory = await Category.findOne({ category: item });
        if (!possibleExistingCategory) {
            const category = new Category({ category: item });
            await category.save();
            console.log(category);
        }
    });
    mongoose.connection.close();

};

// Test users
const users = {
    user1: {
        username: "McFluffy",
        email: "mcfluffy@email.com",
        password: "123456"
    },
    user2: {
        username: "Gavin",
        email: "gavin@email.com",
        password: "asdfghjk"
    },
    user3: {
        username: "Brooke",
        email: "brooke@email.com",
        password: "d*j3Jf23$"
    },
    user4: {
        username: "John",
        email: "John@email.com",
        password: "1234qwer"
    },
}

async function createUsers() {
    try {
        await asyncForEach(Object.values(users), async (value) => {
            const user = new User({
                username: value.username,
                email: value.email,
                password: value.password,
            });
            await user.save();
        });
    } catch (error) {
        console.log(error);
    }
    mongoose.connection.close();
};

// Test posts
const posts = {
    post1: {
        subject: "Rust Bucket",
        description: "A rusty car",
        price: 1200,
        category: "cars",
        user: ""
    },
    post2: {
        subject: "Dusty lamp",
        description: "Has to valuable, right?",
        price: 50,
        category: "antiques",
        user: ""
    },
    post3: {
        subject: "Kitchen Sink",
        description: "Literally the kitchen sink",
        price: 50,
        category: "appliances",
        user: ""
    },
    post4: {
        subject: "Bed",
        description: "30 years old- just like new",
        price: 100,
        category: "furniture",
        user: ""
    },
    post5: {
        subject: "Table Saw",
        description: "Sharp enough to cut off fingers",
        price: 250,
        category: "tools",
        user: ""
    },
    post6: {
        subject: "Tesla",
        description: "Only for $1000000",
        price: 1000000,
        category: "cars",
        user: ""
    },
};

async function createPosts() {
    try {
        let userIds = await User.find({}, "_id");
        userIds = userIds.map(id => id._id);
        let index = 0;
        await asyncForEach(Object.values(posts), async (value) => {

            const category = await Category.findOneAndUpdate({ category: value.category }, { $inc: { number_of_posts: 1 } }, { new: true });
            const post = new Post({
                subject: value.subject,
                description: value.description,
                price: value.price,
                category: category._id,
                user: ""
            });
            post.user = userIds[index % userIds.length];
            await User.findByIdAndUpdate(post.user, { $inc: { number_of_posts: 1 } });
            await post.save();
            index++;
        });
    } catch (error) {
        console.log(error);
    }
    mongoose.connection.close();
}

async function assignDefaultAvatarToAllUsers() {
    let update = {
        $set: { avatar_image: '5c9454f285adca33447018c6'}
    }
    await User.updateMany(update=update)
    mongoose.connection.close();
}

// createCategoryDocuments();
// createUsers();
// createPosts();
// assignDefaultAvatarToAllUsers();