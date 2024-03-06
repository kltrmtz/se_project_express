const router = require("express").Router();
const {
  getItems,
  createItem,
  updateItem,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.delete("/:itemId", deleteItem);

module.exports = router;

// GET /items — returns all clothing items
// POST /items — creates a new item
// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item
// DELETE /items/:itemId — deletes an item by _id
