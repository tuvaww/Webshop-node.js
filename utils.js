function validateArtwork(artwork) {
  let valid = true;

  valid = valid && artwork.name;
  valid = valid && artwork.name.length > 0;
  valid = valid && artwork.imgUrl;
  valid = valid && artwork.imgUrl.length > 0;
  valid = valid && artwork.description;
  valid = valid && artwork.description.length > 0;

  return valid;
}

module.exports = { validateArtwork };
