const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const indexRouter = require("./routes/index");

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
app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler
app.use(errorHandler); // centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
