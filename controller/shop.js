const User = require("../models/Usermodel");

exports.getHome = (req, res) => {
  res.render("home");
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = async (req, res) => {
  const { username, password, email } = req.body;

  const newUser = new User({ username, password, email });

  await newUser.save();
  res.redirect("/");
};

exports.getLogin = (req, res) => {
  res.render("login");
};
