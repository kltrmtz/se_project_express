const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, userLogin } = require("../controllers/users");
const { HTTP_NOT_FOUND } = require("../utils/errors");
const {
  validateUserBodyCreate,
  validateAuth,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", userLogin, validateAuth);
router.post("/signup", createUser, validateUserBodyCreate);

router.use((req, res, next) => {
  next(new HTTP_NOT_FOUND("No document found for query."));
});

module.exports = router;
