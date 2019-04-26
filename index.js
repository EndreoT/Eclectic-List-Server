// Third party dependencies
require('dotenv').config();
// const admin = require("sriracha"); //For dev only
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/authorization");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const imageRoutes = require("./routes/imageRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const mongoDB = process.env.MONGODB_URI || process.env.mLabDB;
// const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;

// Connect to mongoose DB
mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => "You are now connected to Mongo!")
    .catch(err => console.error("Something went wrong!", err));

// app.use("/admin", admin());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/images', imageRoutes);
app.use('/users', userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
