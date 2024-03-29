const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, userLogin } = require("../controllers/users");
const { HTTP_NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", userLogin);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(HTTP_NOT_FOUND).send({ message: "No document found for query." });
});

module.exports = router;
