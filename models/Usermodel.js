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
  savedFavorite: {
    items: [
      {
        artId: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
      },
    ],
  },
});

userSchema.methods.addToCollection = function (art) {
  const artIndex = this.savedFavorite.items.findIndex((ai) => {
    return ai.artId.toString() === art._id.toString();
  });
  const updatedCollectionItems = [...this.savedFavorite.items];

  if (artIndex >= 0) {
    return console.log("art alredy saved");
  } else {
    updatedCollectionItems.push({
      artId: art._id,
    });
    const updatedCollection = {
      items: updatedCollectionItems,
    };
    this.savedFavorite = updatedCollection;
    return this.save();
  }
};

userSchema.methods.removeFromSaved = function (artId) {
  const updatedCollectionItems = this.savedFavorite.items.filter((item) => {
    return item.artId.toString() !== artId.toString();
  });
  this.savedFavorite.items = updatedCollectionItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
