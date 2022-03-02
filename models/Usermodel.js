const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  googleToken: { Type: String },
  id: { type: Number },
  /*   authId: { type: Schema.Types.ObjectId },
   */ savedFavorite: {
    items: [
      {
        artId: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
      },
    ],
  },
  /*  myArt: {
    myItem: [{}]
  } */

  /* email: { type: String, required: true }, */
});

module.exports = mongoose.model("User", userSchema);
