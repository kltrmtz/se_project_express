const User = require("../models/user");
const {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET /users/:userId

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
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
module.exports = { getUsers, createUser, getUser };
