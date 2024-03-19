const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.use(auth);

// const { getUsers, createUser, getUser } = require("../controllers/users");
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

// GET / users / me;
// PATCH /users/me — update profile;

module.exports = router;
