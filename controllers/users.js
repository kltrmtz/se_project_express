const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_USER_DUPLICATED,
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

// app.post('/signup', (req, res) => {
//   bcrypt.hash(req.body.password, 10)
//     .then((hash) => User.create({
//       email: req.body.email,
//       password: hash,
//     }))
//     .then((user) => {
//       res.status(201).send({
//         _id: user._id,
//         email: user.email
//       });
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// });

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name: name, avatar: avatar, email: email, password: hash }),
    )
    .then((user) =>
      res
        .status(201)
        .send({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        }),
    )
    .catch((err) => {
      console.error(err);
      // if (error.code === 11000) {
      //   console.error("Duplicate key error. Document already exists!");
      //   // Handle the duplicate key error here (e.g., retry with different data)
      // }
      if (error.code === 11000) {
        return res
          .status(HTTP_USER_DUPLICATED)
          .send({ message: "Duplicate error." });
        // Handle the duplicate key error here (e.g., retry with different data)
      }
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

// UserLogin
const userLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // authentication successful
      res.send({ message: "Everything good!" });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, userLogin };
