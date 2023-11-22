const express = require("express");
const middleware = require("./../middleware");
const Blog = require("./../schemas/blogSchema");
const User = require("./../schemas/userSchema");
const router = express.Router();

router.get("/", middleware.requireLogin, async (req, res) => {
  let blog = await Blog.find();
  if (blog.length === 0) {
    return res.status(200).render("nothing");
  }
  blog = blog.sort((a, b) => b.readBy - a.readBy);
  blog.forEach((el) => {
    el.title = el.title.slice(0, 20);
    el.body = el.body.slice(0, 70);
  });
  res.render("allBlogs", { blog });
});

router.post("/", async (req, res) => {
  let search = req.body.search;
  let blog = await Blog.find({ title: { $regex: search } });
  blog = blog.reverse();
  let newBlog = blog;

  if (newBlog.length === 0) {
    return res.render("nothing");
  }

  newBlog.forEach((el) => {
    el.title = el.title.slice(0, 20);
    el.body = el.body.slice(0, 70);
  });
  res.render("allBlogs", { blog: newBlog });
});

router.get("/:id", middleware.requireLogin, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  const readBy = Number(blog.readBy) + 1;
  blog = await Blog.findByIdAndUpdate(req.params.id, { readBy }, { new: true });
  blog.owner = blog.postedBy.toString() === req.session.user._id;
  blog.alreadyLiked = req.session.user.likes.includes(blog._id.toString());
  return res.status(200).render("singleBlog", blog);
});

router.get("/delete/:id", async (req, res, next) => {
  await Blog.findByIdAndDelete({ _id: req.params.id });
  return res.status(204).redirect("/blogs");
});

router.get("/update/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  return res.status(200).render("updateBlogForm", { message: "", blog });
});

router.post("/update/:id", async (req, res, next) => {
  if (req.body.title || req.body.coverImage || req.body.body) {
    let newContent = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value) newContent[`${key}`] = value;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      { _id: req.params.id },
      newContent,
      {
        new: true,
      }
    );

    updatedBlog.owner = updatedBlog.postedBy === req.session.user._id;

    return res.status(202).render("singleBlog", updatedBlog);
  } else {
    return res.status(400).render("updateBlogForm", {
      message: "Please fill at least one field to be updated",
      id: req.params.id,
    });
  }
});

router.put("/like/:id", async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;

  // Checking if the user has already liked the post
  const isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);

  // Deciding the operator base of if the user has liked the post
  const option = isLiked ? "$pull" : "$addToSet";

  // Insert user likes
  try {
    req.session.user = await User.findByIdAndUpdate(
      userId,
      {
        [option]: { likes: postId },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(400);
  }

  // Inserting in post likes
  try {
    var blog = await Blog.findByIdAndUpdate(
      postId,
      {
        [option]: { likes: userId },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(400);
  }

  res.status(200).send([blog, req.session.user]);
});

module.exports = router;
