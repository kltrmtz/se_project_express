const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

// const { getUsers, createUser, getUser } = require("../controllers/users");
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

// GET / users / me;
// PATCH /users/me — update profile;

module.exports = router;
