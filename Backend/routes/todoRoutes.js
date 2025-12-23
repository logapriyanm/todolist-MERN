const express = require("express");
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
  restoreTodo,
  permanentlyDeleteTodo
} = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");
router.route("/").get(getTodos).post(createTodo);
router.route("/reorder").put(reorderTodos);
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);
router.route("/:id/restore").put(restoreTodo);
router.route("/:id/permanent").delete(permanentlyDeleteTodo);

module.exports = router;
