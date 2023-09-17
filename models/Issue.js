const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    labels: [String],
    author: String,
    completed: Boolean,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PROJECT",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ISSUE", issueSchema);
