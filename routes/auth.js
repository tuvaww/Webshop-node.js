const bcrypt = require("bcryptjs");

const express = require("express");
const router = express.Router();

const passport = require("passport");
const githubPassport = require("../oAuth/github");
const UserModel = require("../models/Usermodel");

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.

    const alreadyAUser = await UserModel.findOne({ id: req.user.id });
    // console.log("already a user", alreadyAUser);
    if (alreadyAUser) {
      // console.log("use finns");
      req.session.isLoggedIn = true;
      req.session.user = alreadyAUser;
      res.redirect("/");
      return req.session.save((err) => {
        console.log(err);
      });
    } else {
      // console.log("user finns inte");
      const newGitUser = await UserModel.create({
        username: req.user.username,
        password: "noAccess",
        id: req.user.id,
      });
      // console.log("new git user", newGitUser);
      req.session.isLoggedIn = true;
      req.session.user = newGitUser;
      res.redirect("/");
      return req.session.save((err) => {
        console.log(err);
      });
    }
  }
);

router.get("/register", (req, res) => {
  res.render("auth/register", {
    /*     loggedInUser: false,
     */
  });
});

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const userDoc = await UserModel.findOne({ username });
  if (userDoc) {
    return res.render("register", {
      alreadyInUse: "Username already in use",
    });
  } else if (password !== confirmPassword) {
    return res.render("register", {
      comparePasswords: "Passwords do not match",
    });
  } else {
    return bcrypt
      .hash(password, 8)
      .then(async (hashedPassword) => {
        const user = new UserModel({
          username,
          password: hashedPassword,
        });
        await user.save();
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/login", async (req, res) => {
  res.render(
    "auth/login" /* , {
    loggedInUser: false,
  } */
  );
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.render("auth/login", {
      userNotFound: "User not found!",
    });
  }
  const compares = await bcrypt.compare(password, user.password);
  if (compares) {
    /* req.session.isLoggedIn = true; */
    req.session.user = user;
    return req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  }
  res.render("auth/login", {
    wrongData: "Wrong entered data",
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
