const Item = require("../models/clothingItem");
const {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /items

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// POST /items

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// UPDATE /items

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// DELETE /items/:itemId

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((items) => res.status(204).send({ data: items }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
module.exports = { getItems, createItem, updateItem, deleteItem };

// module.exports.createItem = (req, res) => {
//   console.log(req.user._id); // _id will become accessible
// };
