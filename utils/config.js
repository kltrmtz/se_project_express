require("dotenv").config();

const { JWT_SECRET = "secretSecret", NODE_ENV } = process.env;

module.exports = { JWT_SECRET, NODE_ENV };
