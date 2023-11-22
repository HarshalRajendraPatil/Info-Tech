// Requiring all the modules
const mongoose = require("mongoose");

// Defining the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    time: {
      type: String,
      default: new Date().toLocaleString(),
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// Creating the user model
const User = mongoose.model("User", userSchema);

// Exporting the User model.
module.exports = User;
