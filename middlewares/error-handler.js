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
