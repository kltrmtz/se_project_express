const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // add the select field
    minlength: 8,
  },
});

// // we're adding the findUserByCredentials methods to the User schema
// // it will have two parameters, email and password
// userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {

// };

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return User.findOne({ email })
    .select("+password")
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

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error("Incorrect email or password"));
//       }

//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         // the hashes didn't match, rejecting the promise
//         return Promise.reject(new Error("Incorrect email or password"));
//       }

//       // authentication successful
//       res.send({ message: "Everything good!" });
//     })
//     .catch((err) => {
//       res.status(401).send({ message: err.message });
//     });
// };

module.exports = mongoose.model("user", userSchema);
