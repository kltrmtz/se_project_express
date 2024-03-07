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
      console.log(err.name);
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// POST /items

const createItem = (req, res) => {
  // console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
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
      console.log(err.name);
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// PUT /items/:itemId/likes — like an item

const likeItem = (req, res) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// DELETE /items/:itemId/likes — unlike an item

const dislikeItem = (req, res) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_NOT_FOUND).send({ message: err.message });
      }
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
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
module.exports = {
  getItems,
  createItem,
  updateItem,
  likeItem,
  dislikeItem,
  deleteItem,
};

// module.exports.createItem = (req, res) => {
//   console.log(req.user._id); // _id will become accessible
// };
