const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const utils = require("../utils");
const middlewares = require("../middleware/is-auth");
const fileUpload = require("express-fileupload");
const router = express.Router();

// CREATE - POST ARTWORK
router.get("/post", middlewares.authUserPages, (req, res) => {
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
    await newArtwork.save();
    res.redirect("/");
  } else {
    res.render("crud/create", { error: "Something went wrong" });
  }
});

// UPDATE - EDIT ARTWORK

router.get("/artworks/:id/edit", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  res.render("crud/update", artwork);
});

router.post("/artworks/:id/edit", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  await ArtworkModel.findByIdAndUpdate(req.params.id, {
    name,
    imgUrl,
    description,
  });

  res.redirect("/");
});

//READ :ID - SINGEL ART
router.get("artwork/:id", async (req, res) => {
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
