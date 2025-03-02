const mongoose = require("mongoose");

// Define report schema
const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Refers to the 'users' collection
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams", // Refers to the 'exams' collection
    },
    result: {
      type: Object, // Store results as an object (can include pass/fail, scores, etc.)
      required: true, // Ensure result is required
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create a model using the schema
const Report = mongoose.model("reports", reportSchema);

// Export the model for use in other parts of the application
module.exports = Report;
