const express = require("express");

exports.get404 = (req, res) => {
  res.render("404", {
    loggedInUser: req.session.isLoggedIn,
  });
};
