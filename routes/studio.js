const express = require("express");
const router = express.Router();

const ArtworkModel = require("../models/Artworkmodel");

router.get("/", async (req, res) => {
  const artworks = await ArtworkModel.find().lean();
  res.render("home", {
    loggedInUser: req.session.isLoggedIn,
  });
});

module.exports = router;
