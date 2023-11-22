const express = require("express");
const User = require("./../schemas/userSchema");
const bcrypt = require("bcrypt");

const router = express.Router();

let payload = {
  errMsg: "",
};

router.get("/", (req, res) => {
  res.status(200).render("signup", { message: payload.errMsg });
});

// Route for register on POST request
router.post("/", async (req, res, next) => {
  // Creating a global user variable
  let user = null;

  // Creating the user object
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  // Checking if the user has entered all the values
  if (name && email && password) {
    // Checking if there exists a user with same email or username
    try {
      user = await User.findOne({ email });
    } catch {
      payload.errMsg = "Registration failed. Try again later.";
      return res.status(200).render("signup", { message: payload.errMsg });
    }

    // Creating the user if there exists no user with same email or username
    if (user != null) {
      if (email == user.email) {
        payload.errMsg = "Email already in use. Please Login.";
      }
      return res.status(200).render("signup", { message: payload.errMsg });
    } else {
      // Creating the user
      try {
        const data = req.body;

        // hashing the password
        data.password = await bcrypt.hash(data.password, 10);
        data.time = new Date().toLocaleString();

        const newUser = await User.create(data);
        req.session.user = newUser;
        return res.redirect("/");
      } catch {
        payload.errMsg = "Registration failed. Try again later.";
        res.status(200).render("signup", { message: payload.errMsg });
      }
    }
  } else {
    payload.errMsg = "Make sure each field has a value.";
    res.status(200).render("signup", { message: payload.errMsg });
    return;
  }
});

// Exporting the router to the app
module.exports = router;
