const express = require("express");
const Subscriber = require("./../schemas/subscriberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("form");
});

router.post("/", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const subscriber = await Subscriber.findOne({ email });

  if (subscriber !== null) {
    return res.status(200).render("success", { alreadySubs: false });
  }

  const subs = {
    firstName,
    lastName,
    email,
  };

  await Subscriber.create(subs);
  return res
    .status(200)
    .render("success", { firstName, lastName, email, alreadySubs: true });
});

module.exports = router;
