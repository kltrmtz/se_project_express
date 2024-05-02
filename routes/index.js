const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, userLogin } = require("../controllers/users");
const NotFoundError = require("../utils/errors/notFoundError");
const {
  validateUserBodyCreate,
  validateAuth,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", validateAuth, userLogin);
router.post("/signup", validateUserBodyCreate, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("No document found for query."));
});

module.exports = router;
