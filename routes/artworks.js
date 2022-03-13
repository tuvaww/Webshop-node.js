// MODULES

const express = require("express");
const ArtworkModel = require("../models/Artworkmodel");
const UserModel = require("../models/Usermodel");
const utils = require("../utils");
const middlewares = require("../middleware/is-auth");
const path = require("path");

// ROUTER SETUP

const router = express.Router();

// HOME PAGE

router.get("/", async (req, res) => {
  const artworks = await ArtworkModel.find().limit(3).lean();

  res.render("home", { artworks });
});

// READ - ARTWORKS FEED

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

// READ - SINGLE ARTWORK

router.get("/artworks/:id", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id)
    .populate("user")
    .lean();

  if (req.user) {
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
  } else {
    res.render("artworks/artworks-single", {
      artwork,
    });
  }
});

// CREATE - POST ARTWORK

router.get("/post", middlewares.authUserPages, (req, res) => {
  res.render("artworks/artworks-post-edit", { post: true });
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
    res.render("artworks/artworks-post-edit", {
      post: true,
      error: true,
      fileInput: req.files.imageFile,
      nameInput: req.body.name,
      descriptionInput: req.body.description,
    });
  }
});

// UPDATE - EDIT ARTWORK

router.get("/artworks/:id/edit", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);

  const loggedUser = req.user._id.toString();
  const postedBy = artwork.user._id.toString();

  if (loggedUser === postedBy) {
    res.render("artworks/artworks-post-edit", { artwork });
  }
});

router.post("/artworks/:id/edit", async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);
  const { name, description } = req.body;

  const editedArt = {
    name: req.body.name,
    description: req.body.description,
  };

  if (utils.validateArtwork(editedArt)) {
    await ArtworkModel.findByIdAndUpdate(req.params.id, { name, description });

    res.redirect("/artworks/" + req.params.id);
  } else {
    res.render("artworks/artworks-post-edit", {
      artwork,
      error: true,
    });
  }
});

// DELETE - DELETE ARTWORK

router.post("/delete/:id", async (req, res) => {
  await ArtworkModel.findByIdAndDelete(req.params.id);

  const artId = req.params.id;

  await UserModel.updateMany(
    {},
    { $pull: { "savedFavorite.items": { artId } } },
    { multi: true }
  );

  res.redirect("/artworks");
});

module.exports = router;
