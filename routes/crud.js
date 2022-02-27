const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const router = express.Router();

// CREATE - POST ARTWORK
router.get("/post", (req, res) => {
  res.render("post-edit");
});

router.post("/post", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  const newArtwork = new ArtworkModel({
    name,
    imgUrl,
    description,
    userId: req.session.user._id,
  });

  await newArtwork.save();
  res.redirect("/post");
});

module.exports = router;
