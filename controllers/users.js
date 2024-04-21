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

// POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Duplicate user");
        error.statusCode = HTTP_USER_DUPLICATED;
        throw error;
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      }),
    )

    .catch((err) => {
      if (err.statusCode === HTTP_USER_DUPLICATED) {
        next(new HTTP_USER_DUPLICATED("Duplicate error."));
      }
      if (err.name === "ValidationError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new HTTP_NOT_FOUND("No document found for query."));
      } else {
        next(err);
      }
      // console.error(err);
      // if (err.statusCode === HTTP_USER_DUPLICATED) {
      //   return res
      //     .status(HTTP_USER_DUPLICATED)
      //     .send({ message: "Duplicate error." });
      // }
      // if (err.name === "ValidationError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // return res
      //   .status(HTTP_INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// UserLogin
const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.message === "Incorrect email or password") {
        next(new HTTP_UNAUTHORIZED("Unauthorized data."));
      } else {
        next(err);
      }
      // console.error(err);

      // if (err.name === "ValidationError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // if (err.message === "Incorrect email or password") {
      //   return res
      //     .status(HTTP_UNAUTHORIZED)
      //     .send({ message: "Unauthorized data." });
      // }
      // return res
      //   .status(HTTP_INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// GET currentUser

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.name === "ValidationError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new HTTP_NOT_FOUND("No document found for query."));
      } else {
        next(err);
      }
      // console.error(err);
      // if (err.name === "CastError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // if (err.name === "ValidationError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // if (err.name === "DocumentNotFoundError") {
      //   return res
      //     .status(HTTP_NOT_FOUND)
      //     .send({ message: "No document found for query." });
      // }
      // return res
      //   .status(HTTP_INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      console.log(user);
      res.status(200).send({ data: user });
      return user;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.name === "ValidationError") {
        next(new HTTP_BAD_REQUEST("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new HTTP_NOT_FOUND("No document found for query."));
      } else {
        next(err);
      }
      // console.error(err);
      // console.log(err.name);
      // if (err.name === "CastError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // if (err.name === "ValidationError") {
      //   return res.status(HTTP_BAD_REQUEST).send({ message: "Invalid data" });
      // }
      // if (err.name === "DocumentNotFoundError") {
      //   return res
      //     .status(HTTP_NOT_FOUND)
      //     .send({ message: "No document found for query." });
      // }
      // return res
      //   .status(HTTP_INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateProfile,
};
