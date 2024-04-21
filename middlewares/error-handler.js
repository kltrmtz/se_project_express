const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res
    .status(HTTP_INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server." });
};

module.exports = errorHandler;

// .catch((err) => {
//   if (err.name === "CastError") {
//     next(new BadRequestError("The id string is in an invalid format");
//   } else {
//     next(err);
//   }
// );

// try {
//   payload = jwt.verify(token, 'some-secret-key');
// } catch (e) {
//   const err = new Error('Authorization required');
//   err.statusCode = 401;

//   next(err);
// }
// errors/not-found-err.js

// class NotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 404;
//   }
// }

// module.exports = NotFoundError;

// const NotFoundError = require("./errors/not-found-err");

// module.exports.getProfile = (req, res, next) =>
//   User.findOne({ _id: req.params.userId }).then((user) => {
//     if (!user) {
//       // if there is no such user,
//       // throw an exception
//       throw new NotFoundError("No user with matching ID found");
//     }

//     res.send(user);
//   });
// // ...
// const NotFoundError = require("./errors/not-found-err");

// module.exports.getProfile = (req, res, next) =>
//   User.findOne({ _id: req.params.userId })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError("No user with matching ID found");
//       }

//       res.send(user);
//     })
//     .catch(next); // in the catch block, call the next middleware
// // .catch(err => next(err));

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.statusCode).send({ message: err.message });
// });

// const NotFoundError = require("./errors/not-found-err");
// const BadRequestError = require("./errors/bad-request-err");

// module.exports.getProfile = (req, res, next) =>
//   User.findOne({ _id: req.params.userId })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError("No user with matching ID found");
//       }

//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(new BadRequestError("The id string is in an invalid format"));
//       } else {
//         next(err);
//       }
//     });
