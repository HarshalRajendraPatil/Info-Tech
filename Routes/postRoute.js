const express = require("express");
const middleware = require("./../middleware");
const Blog = require("./../schemas/blogSchema");

const router = express.Router();

router.get("/", middleware.requireLogin, (req, res) => {
  return res.status(200).render("blogpost", { message: "" });
});

router.post("/", async (req, res) => {
  if (
    req.body.title.trim() &&
    req.body.content.trim() &&
    req.body.image.trim()
  ) {
    let blog = {
      title: req.body.title,
      body: req.body.content,
      coverImage: req.body.image,
      postedBy: req.session.user._id,
      time: new Date().toLocaleString(),
    };
    const data = await Blog.create(blog);
    blog = {
      title: req.body.title,
      body: req.body.content,
      coverImage: req.body.image,
      owner: data.postedBy.toString() === req.session.user._id,
      time: data.time,
      _id: data._id,
      likes: "",
      alreadyLiked: false,
    };
    return res.status(200).render("singleBlog", blog);
  } else {
    return res.status(400).render("blogpost", {
      message: "Please enter a valid data in given fields",
    });
  }
});

module.exports = router;
