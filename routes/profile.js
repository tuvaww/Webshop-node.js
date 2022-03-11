const express = require("express");
const router = express.Router();
const UserModel = require("../models/Usermodel");
const ArtworkModel = require("../models/Artworkmodel.js");

router.get("/users/:id", async (req, res) => {
  console.log(req.params.id);

  const user = await UserModel.findById(req.params.id);
  console.log(user);
  const userId = req.user._id;
  const artworks = await ArtworkModel.find({ user }).populate("user").lean();

  res.render("artworks/artworks", {
    artworks,
    user,
    profilePage: true,
  });
});

module.exports = router;
