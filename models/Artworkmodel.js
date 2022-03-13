const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artworkSchema = new Schema({
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Artwork", artworkSchema);
