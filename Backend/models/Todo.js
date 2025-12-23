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
    reminder: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    subTasks: [
        {
            title: String,
            isCompleted: { type: Boolean, default: false }
        }
    ],
    attachments: [
        {
            url: String,
            publicId: String,
            fileName: String,
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
