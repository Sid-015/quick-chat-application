const mongoose = require("mongoose");
const { profile } = require("node:console");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, minlength: 8 }, // select: false means that when we query the user data from the database, the password field will not be included in the result by default. This is a security measure to prevent accidental exposure of hashed passwords when fetching user data. If you need to include the password field in a query, you can explicitly specify it using .select('+password') in your Mongoose query.
    profilePicture: { type: String, required: false }, // URL to profile picture
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

//Using the scema a model will be created and that model will be used to populate the database

module.exports = mongoose.model("users", userSchema); //users is the name of the collection in the database
