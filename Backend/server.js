// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allowed origins (add any frontend domains you use)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  // add your deployed frontend URL(s) here:
  "https://todolist-mern-e0un.onrender.com",
  "https://your-other-frontend.example.com"
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS request from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// enable preflight for all routes
app.options("*", cors(corsOptions));

// --- rest of your code unchanged ---
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message || err);
    process.exit(1);
  });

// Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
}, { timestamps: true });

// Model
const todoModel = mongoose.model("Todo", todoSchema);

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find().sort({ createdAt: -1 });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await todoModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// Start the server
const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
