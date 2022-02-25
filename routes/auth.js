const bcrypt = require("bcryptjs");

const express = require("express");
const router = express.Router();

const UserModel = require("../models/Usermodel");

router.get("/register", (req, res) => {
  res.render("register", {
    loggedInUser: false,
  });
});

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  UserModel.findOne({ username })
    .then((userDoc) => {
      if (userDoc) {
        return res.render("register", {
          alreadyInUse: "Username already in use",
        });
        /*         return res.redirect("/register");
         */
      } else if (password !== confirmPassword) {
        return res.render("register", {
          comparePasswords: "Passwords do not match",
        });
      } else {
        return bcrypt
          .hash(password, 8)
          .then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      }
    })

    .catch((err) => {
      console.log(err);
    });
});

router.get("/login", (req, res) => {
  res.render("login", {
    loggedInUser: false,
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username })
    .then((user) => {
      if (!user) {
        /*         return res.redirect("/login");
         */ return res.render("login", {
          userNotFound: "User not found!",
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              return res.redirect("/");
            });
          }
          res.render("login", {
            wrongData: "Wrong entered data",
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
