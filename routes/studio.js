const express = require("express");
const router = express.Router();

const ArtworkModel = require("../models/Artworkmodel");

router.get("/", async (req, res) => {
  const artworks = await ArtworkModel.find().limit(3).lean();

  res.render("home", { artworks });
});

router.get("/artworks", async (req, res) => {
  const artworks = await ArtworkModel.find().lean();

  const savedFavorites = req.user.savedFavorite.items.map((item) =>
    item.artId.toString()
  );

  artworks.forEach((item) => {
    item.isSaved = savedFavorites.includes(item._id.toString());
  });

  if (req.user) {
    return res.render("artworks/artworks", { artworks, loggedInUser: true });
  } else {
    return res.render("artworks/artworks", { artworks, loggedInUser: false });
  }
});

module.exports = router;
