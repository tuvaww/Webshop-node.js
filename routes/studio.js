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

/* router.get("/artworks", (req, res) => {
  ProductModel.find()
    .then((art) => {
      console.log("get art", art);
      res.render("artworks", {
        isLoggedIn: req.session.isLoggedIn,
        arts: art,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}); */

module.exports = router;
