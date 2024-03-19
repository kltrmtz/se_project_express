require("dotenv").config();

const { JWT_SECRET = "secretSecret" } = process.env;

module.exports = { JWT_SECRET };
