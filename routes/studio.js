const express = require("express");
const router = express.Router();

const ArtworkModel = require("../models/Artworkmodel");

router.get("/", async (req, res) => {
  const artworks = await ArtworkModel.find().limit(3).lean();

  res.render("home", {
    art: artworks,
    loggedInUser: req.session.isLoggedIn,
  });
});

router.get("/artworks", async (req, res) => {
  const artworks = await ArtworkModel.find().lean();
  res.render("artworks/artworks", {
    isLoggedIn: req.session.isLoggedIn,
    artworks: artworks,
  });
});

module.exports = router;
