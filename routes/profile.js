const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/Artworkmodel.js");
const middlewares = require("../middleware/is-auth");

router.get("/profile", middlewares.authUserPages, async (req, res) => {
  const user = req.user.username;
  const id = req.user._id;
  const art = await ArtworkModel.find({ id });

  res.render("auth/profile", { artworks: art, user, id });
});

module.exports = router;
