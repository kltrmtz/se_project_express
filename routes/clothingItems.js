const router = require("express").Router();
const {
  getItems,
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateClothingItemBodyCreate,
  validateId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post("/", validateClothingItemBodyCreate, createItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;

// GET /items — returns all clothing items
// POST /items — creates a new item
// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item
// DELETE /items/:itemId — deletes an item by _id
