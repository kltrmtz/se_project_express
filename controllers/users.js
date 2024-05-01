const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const BadRequestError = require("../utils/errors/badRequestError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");
const NotFoundError = require("../utils/errors/notFoundError");
const DuplicateError = require("../utils/errors/duplicateError");

// POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(BadRequestError).send({ message: "Invalid data" });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Duplicate user");
        error.statusCode = DuplicateError;
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
      if (err.statusCode === DuplicateError) {
        next(new DuplicateError("Duplicate error."));
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

// UserLogin
const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(BadRequestError).send({ message: "Invalid data" });
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
        next(new BadRequestError("Invalid data"));
      }
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Unauthorized data."));
      } else {
        next(err);
      }
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

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateProfile,
};
