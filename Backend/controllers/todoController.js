const Todo = require("../models/Todo");
const { getIo } = require("../utils/socket");

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { status, priority, search, sortBy, sortOrder } = req.query;

    let query = { userId: req.user._id };

    // Filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Sorting
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const todos = await Todo.find(query).sort(sortOptions);
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, dueTime, category, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Get the highest order to append to the end
    const lastTodo = await Todo.findOne({ userId: req.user._id }).sort("-order");
    const order = lastTodo ? lastTodo.order + 1 : 0;

    const todo = await Todo.create({
      userId: req.user._id,
      title,
      description,
      dueDate,
      dueTime,
      category,
      tags,
      order,
    });

    const io = getIo();
    io.to(req.user._id.toString()).emit("todo_created", todo);

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Check user ownership
    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Prevent updating if deleted
    if (todo.isDeleted) {
      return res.status(400).json({ message: "Cannot update a todo in trash" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const io = getIo();
    io.to(req.user._id.toString()).emit("todo_updated", updatedTodo);

    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Soft delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Toggle soft delete or hard delete based on query param if needed
    // For now, let's just do soft delete as per requirement
    todo.isDeleted = true;
    await todo.save();

    const io = getIo();
    io.to(req.user._id.toString()).emit("todo_deleted", req.params.id);

    res.json({ message: "Todo moved to trash" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Rearrange todos (Drag & Drop)
// @route   PUT /api/todos/reorder
// @access  Private
const reorderTodos = async (req, res) => {
    try {
        const { newOrder } = req.body; // Expecting an array of { id, order }

        if (!newOrder || !Array.isArray(newOrder)) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const updatePromises = newOrder.map(item => 
            Todo.updateOne({ _id: item.id, userId: req.user._id }, { order: item.order })
        );

        await Promise.all(updatePromises);
        
        const io = getIo();
        io.to(req.user._id.toString()).emit("todos_reordered", newOrder);

        res.json({ message: "Reordered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

// @desc    Restore a todo from trash
// @route   PUT /api/todos/:id/restore
// @access  Private
const restoreTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        todo.isDeleted = false;
        await todo.save();

        const io = getIo();
        io.to(req.user._id.toString()).emit("todo_restored", todo);

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Permanently delete a todo
// @route   DELETE /api/todos/:id/permanent
// @access  Private
const permanentlyDeleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Todo.findByIdAndDelete(req.params.id);

        const io = getIo();
        io.to(req.user._id.toString()).emit("todo_permanently_deleted", req.params.id);

        res.json({ message: "Todo permanently deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
  restoreTodo,
  permanentlyDeleteTodo
};
