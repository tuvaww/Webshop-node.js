const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const utils = require("../utils");
const middlewares = require("../middleware/is-auth");
const router = express.Router();

// CREATE - POST ARTWORK
router.get("/post", middlewares.authUserPages, (req, res) => {
  res.render("crud/create");
});

router.post("/post", async (req, res) => {
  const image = req.files.image;
  const { name, description } = req.body;

  const fileName = utils.getUniqueFileName(image.name);
  const uploadPath = __dirname + "/public/uploads/" + fileName;

  await image.mv(uploadPath);

  const newArtwork = new ArtworkModel({
    name,
    imgUrl: "/uploads/" + fileName,
    description,
    userId: req.session.user._id,
  });

  if (utils.validateArtwork(newArtwork)) {
    const result = await artwork.save();
    res.redirect("/artworks/" + result._id);
  } else {
    res.render("crud/create", { error: "Something went wrong" });
  }
});

// READ - SINGLE ARTWORK
router.get("/artwork/:id", async (req, res) => {
  const artworks = await ArtworkModel.findById(req.params.id).lean();

  res.render("artworks/artworks-single", artworks);
});

// UPDATE - EDIT ARTWORK

router.get("/update/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  res.render("crud/update", artwork);
});

router.post("/update/:id/edit", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  await ArtworkModel.findByIdAndUpdate(req.params.id, {
    name,
    imgUrl,
    description,
  });

  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  res.render("artworks/artworks-delete", artwork);
});

router.post("/delete/:id", async (req, res) => {
  const { name, imgUrl, description } = req.body;

  await ArtworkModel.findByIdAndDelete(req.params.id, {
    name,
    imgUrl,
    description,
  });

  res.redirect("/");
});

module.exports = router;
