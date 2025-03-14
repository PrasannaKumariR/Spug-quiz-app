const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    correctOption: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },
    isGenerated: { type: Boolean, default: false }, // To mark AI-generated questions
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
