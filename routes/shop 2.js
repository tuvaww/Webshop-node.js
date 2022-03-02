const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  const newUser = new User({ username, password, email });

  await newUser.save();
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
