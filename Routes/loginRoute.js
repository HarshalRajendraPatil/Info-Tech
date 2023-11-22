const express = require("express");
const User = require("./../schemas/userSchema");
const middleware = require("./../middleware");
const bcrypt = require("bcrypt");

const router = express.Router();
let payload = {
  errMsg: "",
};

router.get("/", (req, res) => {
  res.status(200).render("login", { payload });
});

// Route for login on POST request
router.post("/", async (req, res, next) => {
  let user = null;
  payload = req.body;

  // Finding the user with the given email or password
  if (req.body.logEmail && req.body.logPassword) {
    try {
      user = await User.findOne({ email: req.body.logEmail });
    } catch {
      payload.errMsg = "Login failed. Try again later.";
      return res.status(200).render("login", { payload });
    }

    // Comparing passwords when user is found
    if (user != null) {
      const result = await bcrypt.compare(req.body.logPassword, user.password);

      if (result) {
        req.session.user = user;
        return res.status(200).redirect("/");
      }
    }

    // Showing the error when email or password is incorrect
    payload.errMsg = "Incorrect Email or Password. Try again";
    return res.status(200).render("login", { payload });
  }

  // Showing the error when user does not fill the required fields
  payload.errMsg = "Make sure to fill all the values.";
  return res.status(200).render("login", { payload });
});

module.exports = router;
