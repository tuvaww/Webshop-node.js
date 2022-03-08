const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/Artworkmodel.js");
const UserModel = require("../models/Usermodel.js");
const utils = require("../utils");
const isAuth = require("../middleware/is-auth");

router.get("/profile", isAuth.authUserPages, async (req, res) => {
  const user = await UserModel.findById(req.params.id).lean();
  const artwork = await ArtworkModel.find({ user: req.params.id }).lean();

  res.render("auth/profile", { user, artwork });
});

module.exports = router;
