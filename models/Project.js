const mongoose = require("mongoose");
const ISSUE = require("./Issue");

const projectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    author: String,
    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ISSUE",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to remove associated issues when a project is removed
projectSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await ISSUE.deleteMany({ _id: { $in: this.issues } });
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("PROJECT", projectSchema);
