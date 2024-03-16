const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

// const { getUsers, createUser, getUser } = require("../controllers/users");
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("users/me", getCurrentUser);
router.patch("users/me", updateProfile);

// GET / users / me;
// PATCH /users/me — update profile;

module.exports = router;
