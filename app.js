const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const indexRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(helmet());

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", indexRouter);

app.use(requestLogger);
// app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler
app.use(errorHandler); //centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use((err, req, res, next) => {
//   // this is the error handler
// });

// app.use((err, req, res, next) => {
//   console.error(err);
//   // if an error has no status, set it to 500
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).send({
//     // check the status and display a message based on it
//     message: statusCode === 500 ? "An error occurred on the server" : message,
//   });
// });

// we handle all errors here, by logging the error to the console
// and sending a response with an appropriate status code and message
// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(500).send({ message: "An error occurred on the server" });
// });

// next("Argument");
// next(new Error("Authorization error"));

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.send({ message: err.message });
// });

// { "message": "Authorization error" }
