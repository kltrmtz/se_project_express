const Item = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/badRequestError");
const ForbiddenError = require("../utils/errors/forbiddenError");
const NotFoundError = require("../utils/errors/notFoundError");

// GET /items

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

// POST /items

const createItem = (req, res, next) => {
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
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

// PUT /items/:itemId/likes — like an item

const likeItem = (req, res, next) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No document found for query."));
      } else {
        next(err);
      }
    });
};

// DELETE /items/:itemId/likes — unlike an item

const dislikeItem = (req, res, next) => {
  console.log(req.params.itemId);
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No document found for query."));
      } else {
        next(err);
      }
    });
};

// DELETE /items/:itemId

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError(
            "You do not have not permission to access this resource.",
          ),
        );
      }

      return Item.findByIdAndDelete(itemId)
        .orFail()
        .then(() => res.status(200).send(item));
    })

    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No document found for query."));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getItems,
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
};
