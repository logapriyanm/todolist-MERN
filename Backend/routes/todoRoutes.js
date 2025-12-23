const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
  restoreTodo,
  permanentlyDeleteTodo
} = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect); // Protect all todo routes

router.route("/").get(getTodos).post(upload.array("attachments", 5), createTodo);
router.route("/reorder").put(reorderTodos);
router.route("/:id").put(updateTodo).delete(deleteTodo);
router.route("/:id/restore").put(restoreTodo);
router.route("/:id/permanent").delete(permanentlyDeleteTodo);

module.exports = router;
