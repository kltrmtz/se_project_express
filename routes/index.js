const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { HTTP_NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(HTTP_NOT_FOUND).send({ message: "No document found for query." });
});

module.exports = router;
