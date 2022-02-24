const express = require("express");
const router = express.Router();

const UserModel = require("../models/Usermodel");
const ProductModel = require("../models/Productmodel");

router.get("/", (req, res) => {
  res.render("home", {
    loggedInUser: req.session.isLoggedIn,
  });
});

/* router.get("/products", (req, res) => {
  ProductModel.find()
    .then((products) => {
      console.log("get products", products);
      res.render("products", {
        isLoggedIn: req.session.isLoggedIn,
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}); */

module.exports = router;
