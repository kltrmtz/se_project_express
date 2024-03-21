const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { HTTP_UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: "Authorization Required" });
  }

  req.user = payload; // assigning the payload to the request object

  next(); // sending the request to the next middleware
  return;
};

module.exports = { auth };
