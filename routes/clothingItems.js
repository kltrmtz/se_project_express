const router = require("express").Router();
const {
  getItems,
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");

router.get("/", getItems);

router.use(auth);

router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.delete("/:itemId", deleteItem);

module.exports = router;

// GET /items — returns all clothing items
// POST /items — creates a new item
// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item
// DELETE /items/:itemId — deletes an item by _id
