const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: {},
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {},
  likes: {},
  createdAt: {},
});

module.exports = mongoose.model("item", clothingItemSchema);
