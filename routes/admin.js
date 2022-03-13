const express = require("express");
const router = express.Router();
const ArtworkModel = require("../models/Artworkmodel");
const UserModel = require("../models/Usermodel");

const isAuth = require("../middleware/is-auth");

router.get("/saved", isAuth.authUserPages, async (req, res) => {
  req.user
    .populate("savedFavorite.items.artId")
    .then((user) => {
      const artworks = user.savedFavorite.items.map((item) => item.artId);

      artworks.forEach((item) => {
        item.isSaved = true;
      });

      res.render("artworks/artworks", { artworks });
    })
    .catch((err) => console.log(err));
});

router.post("/save", (req, res) => {
  const artId = req.body.artId;

  ArtworkModel.findById(artId)
    .then((art) => {
      return req.user.addToCollection(art);
    })
    .then((result) => {
      res.redirect("back");
    })
    .catch((err) => console.log(err));
});

router.post("/saved-delete-item", (req, res) => {
  const artId = req.body.artId;

  req.user
    .removeFromSaved(artId)
    .then((result) => {
      res.redirect("back");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
