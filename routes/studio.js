const express = require("express");
const router = express.Router();

const ArtworkModel = require("../models/Artworkmodel");

router.get("/", (req, res) => {
  res.render("home", {
    loggedInUser: req.session.isLoggedIn,
  });
});

router.get("artwork/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id).lean();

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
