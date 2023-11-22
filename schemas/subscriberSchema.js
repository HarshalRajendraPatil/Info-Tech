// Requiring all the modules
const mongoose = require("mongoose");

// Defining the user schema
const subscriberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
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
  },
  { timestamps: true }
);

// Creating the user model
const Subscriber = mongoose.model("Subscribers", subscriberSchema);

// Exporting the User model.
module.exports = Subscriber;
