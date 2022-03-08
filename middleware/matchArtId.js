exports.matchArtId = (req, res, next) => {
  if (user.objectid === artwork.user.objectid) {
    res.render("/update/:id/edit");
  }
  next();
};

exports.matchUserArt = (req, res, next) => {
  if (results.user.equals(artwork.user._id)) {
  }
  next();
};
