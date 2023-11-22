const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A blog must contain a title"],
    },
    body: {
      type: String,
      required: [true, "Please upload a Blog body"],
    },
    coverImage: {
      type: String,
      required: [true, "Please upload a image"],
    },
    time: {
      type: String,
      default: new Date().toLocaleString(),
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    readBy: {
      type: Number,
      default: 0,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
