const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done", "Archived"],
      default: "Todo",
    },
    dueDate: {
      type: Date,
    },
    dueTime: {
      type: String,
    },
    category: {
      type: String,
      default: 'Work',
    },
    reminder: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
