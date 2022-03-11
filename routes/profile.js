const express = require("express");
const router = express.Router();
const UserModel = require("../models/Usermodel");
const ArtworkModel = require("../models/Artworkmodel.js");

router.get("/users/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  const artworks = await ArtworkModel.find({ user }).populate("user").lean();

  if (req.user) {
    const savedFavorites = req.user.savedFavorite.items.map((item) =>
      item.artId.toString()
    );

    artworks.forEach((item) => {
      item.isSaved = savedFavorites.includes(item._id.toString());
    });

    res.render("artworks/artworks", {
      artworks,
      user,
      profilePage: true,
    });
  }
});

module.exports = router;
