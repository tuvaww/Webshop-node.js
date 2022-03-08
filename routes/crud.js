const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const utils = require("../utils");
const middlewares = require("../middleware/is-auth");
const path = require("path");
const router = express.Router();

// CREATE - POST ARTWORK
router.get("/post", middlewares.authUserPages, (req, res) => {
  res.render("crud/create");
});

router.post("/post", async (req, res) => {
  const image = req.files.imageFile;
  const filename = utils.getUniqueFilename(image.name);
  publicPath = path.join(__dirname, "..");
  const uploadPath = publicPath + "/public/uploads/" + filename;

  await image.mv(uploadPath);

  const { name, description } = req.body;

  const newArtwork = new ArtworkModel({
    name,
    imgUrl: "/uploads/" + filename,
    description,
    user: req.session.user,
  });

  if (utils.validateArtwork(newArtwork)) {
    const result = await newArtwork.save();
    res.redirect("/artworks/" + result._id);
  } else {
    res.render("crud/create", { error: "Something went wrong" });
  }
});

// READ - SINGLE ARTWORK
router.get("/artworks/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id).populate("user").lean();

  const loggedUser = req.user._id.toString();
  const postedBy = artwork.user._id.toString();

  if (loggedUser === postedBy) {
    return res.render("artworks/artworks-single", {
      artwork,
      myPosts: true,
    });
  } else {
    return res.render("artworks/artworks-single", {
      artwork,
      myPosts: false,
    });
  }
});

// UPDATE - EDIT ARTWORK

router.get("/update/:id", middlewares.authUserPages, async (req, res) => {
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

router.get("/delete/:id", middlewares.authUserPages, async (req, res) => {
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
