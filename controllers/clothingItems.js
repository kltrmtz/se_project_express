const Item = require("../models/clothingItem");
const {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
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
        .send({ message: "An error has occurred on the server." });
    });
};

// POST /items

const createItem = (req, res) => {
  console.log(req.user._id);
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
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// PUT /items/:itemId/likes — like an item

const likeItem = (req, res) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_NOT_FOUND)
          .send({ message: "No document found for query." });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// DELETE /items/:itemId/likes — unlike an item

const dislikeItem = (req, res) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_NOT_FOUND)
          .send({ message: "No document found for query." });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// DELETE /items/:itemId

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      // if (!item.owner.equals(req.user_id)) {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(HTTP_FORBIDDEN).send({
          message: "You do not have not permission to access this resource.",
        });
      }

      return Item.findByIdAndDelete(itemId)
        .orFail()
        .then(() => res.status(200).send(item));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_NOT_FOUND)
          .send({ message: "No document found for query." });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
module.exports = {
  getItems,
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
};
