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

router.get("/", getItems, validateId);

router.use(auth);

router.post("/", createItem, validateClothingItemBodyCreate);
router.put("/:itemId/likes", likeItem, validateId);
router.delete("/:itemId/likes", dislikeItem, validateId);
router.delete("/:itemId", deleteItem, validateId);

module.exports = router;

// GET /items — returns all clothing items
// POST /items — creates a new item
// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item
// DELETE /items/:itemId — deletes an item by _id
