const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const utils = require("../utils");
const middlewares = require("../middleware/is-auth");

const router = express.Router();

router.get("/artworks", async (req, res) => {
  const artworks = await ArtworkModel.find().lean();
  res.render("artworks", {
    isLoggedIn: req.session.isLoggedIn,
    artworks: artworks,
  });
});

// CREATE - POST ARTWORK
router.get("/post", middlewares.authUserPages, async (req, res) => {
  res.render("crud/create");
});

router.post("/post", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  const newArtwork = new ArtworkModel({
    name,
    imgUrl,
    description,
    userId: req.session.user._id,
  });

  if (utils.validateArtwork(newArtwork)) {
    //await newArtwork.save();
    const newArtwork = new ArtworkModel(req.body);
    const result = await newArtwork.save();
    res.render("artworks" + result._id);
  } else {
    res.render("crud/create", { error: "Something went wrong" });
  }
});

//READ :ID - SINGEL ART
router.get("artwork/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id).lean();

  res.render("artworks-single", artwork);
});

// UPDATE - EDIT ARTWORK

router.get("/artwork/:id/edit", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  res.render("crud/update", artwork);
});

router.post("/artwork/:id/edit", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  await ArtworkModel.findByIdAndUpdate(req.params.id, {
    name,
    imgUrl,
    description,
  });

  res.redirect("/");
});

module.exports = router;
