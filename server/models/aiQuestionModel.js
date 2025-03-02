const mongoose = require("mongoose");

const aiQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true, // Text of the AI-generated question
    },
    topic: {
      type: String,
      required: true, // The topic for which the question is generated
    },
    options: {
      type: [String], // Array of possible answers (multiple-choice options)
      required: true,
    },
    correctOption: {
      type: String, // The correct answer
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const AiQuestion = mongoose.model("aiQuestions", aiQuestionSchema);
module.exports = AiQuestion;
