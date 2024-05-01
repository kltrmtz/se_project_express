const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { HTTP_UNAUTHORIZED } = require("../utils/errors/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new HTTP_UNAUTHORIZED("Authorization Required"));

    // return res
    //   .status(HTTP_UNAUTHORIZED)
    //   .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new HTTP_UNAUTHORIZED("Authorization Required"));
    // return res
    //   .status(HTTP_UNAUTHORIZED)
    //   .send({ message: "Authorization Required" });
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};

module.exports = { auth };
