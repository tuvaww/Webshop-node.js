const express = require("express");
const router = express.Router();

const UserModel = require("../models/Usermodel");

router.get("/", (req, res) => {
  res.render("home", {
    loggedInUser: req.session.isLoggedIn,
  });
});

module.exports = router;
