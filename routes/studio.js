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

router.get("artworks/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  res.render("artworks/artworks-single", artwork);
});

router.get("/artworks", async (req, res) => {
  const art = await ArtworkModel.find().lean();
  res.render("artworks/artworks", {
    isLoggedIn: req.session.isLoggedIn,
    arts: art,
  });
});

module.exports = router;
