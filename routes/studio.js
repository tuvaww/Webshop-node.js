const express = require("express");
const router = express.Router();

const ArtworkModel = require("../models/Artworkmodel");

router.get("/", async (req, res) => {
  const artworks = await ArtworkModel.find().limit(3).lean();

  if (req.user) {
    const user = req.user._id;

    res.render("home", { artworks, user });
  } else {
    res.render("home", { artworks });
  }
});

router.get("/artworks", async (req, res) => {
  const artworks = await ArtworkModel.find().lean();

  if (req.user) {
    const savedFavorites = req.user.savedFavorite.items.map((item) =>
      item.artId.toString()
    );

    artworks.forEach((item) => {
      item.isSaved = savedFavorites.includes(item._id.toString());
    });

    return res.render("artworks/artworks", { artworks, loggedInUser: true });
  } else {
    return res.render("artworks/artworks", { artworks, loggedInUser: false });
  }
});

module.exports = router;
