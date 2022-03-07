const express = require("express");
const router = express.Router();
const ArtModel = require("../models/Artworkmodel");
const Usermodel = require("../models/Usermodel");

/* const isAuth = require("../middleware/is-auth");
 */

router.get("/saved", async (req, res) => {
  req.user
    .populate("savedFavorite.items.artId")
    .then((user) => {
      // console.log("user", user);
      const art = user.savedFavorite.items;

      //console.log(products);
      res.render("artworks/saved-art", {
        art: art,
      });
    })
    .catch((err) => console.log(err));
});

router.post("/save", (req, res) => {
  const artId = req.body.artId;

  ArtModel.findById(artId)
    .then((art) => {
      return req.user.addToCollection(art);
    })
    .then((result) => {
      res.redirect("/admin/saved");
    })
    .catch((err) => console.log(err));
});

router.post("/saved-delete-item", (req, res) => {
  const artId = req.body.artId;
  req.user
    .removeFromSaved(artId)
    .then((result) => {
      res.redirect("/admin/saved");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
