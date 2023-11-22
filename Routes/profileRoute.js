const express = require("express");
const Blog = require("./../schemas/blogSchema");
const middleware = require("./../middleware");
const Subscriber = require("./../schemas/subscriberSchema");
const router = express.Router();

router.get("/", middleware.requireLogin, async (req, res) => {
  let blog = await Blog.find({ postedBy: req.session.user._id });
  // if (blog.length === 0) {
  //   return res.status(200).render("nothing");
  // }
  blog = blog.sort((a, b) => b.createdAt - a.createdAt);
  blog.forEach((el) => {
    el.title = el.title.slice(0, 20);
    el.body = el.body.slice(0, 70);
  });
  const isSubs = await Subscriber.findOne({ email: req.session.user.email });
  let sub;
  if (isSubs) {
    sub = "Yes";
  } else {
    sub = "No";
  }
  return res.status(200).render("profilePage", {
    name: req.session.user.name,
    email: req.session.user.email,
    joined: req.session.user.time,
    isSubs: sub,
    numBlog: blog.length,
    blog,
  });
});

module.exports = router;
