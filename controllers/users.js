const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
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
      res.status(201).send({
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (!user) {
        return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(HTTP_UNAUTHORIZED)
        .send({ message: "An error has occurred on the server." });
    });
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // we're creating a token
//       const token = jwt.sign({ _id: user._id }, 'some-secret-key');

//       // we return the token
//       res.send({ token });
//     })
//     .catch((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

// GET currentUser

const getCurrentUser = (req, res) => {
  const { userId } = req.params.user._id;

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

const updateProfile = (req, res) => {
  const { userId } = req.params.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { userId, name, avatar },
    { new: true },
    { runValidators: true },
  )
    .orFail()
    .then((user) => {
      console.log(user);
      res.status(200).send({ data: user });
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

// module.exports = { getUsers, createUser, getUser, userLogin };
module.exports = {
  getUsers,
  createUser,
  getUser,
  userLogin,
  getCurrentUser,
  updateProfile,
};
