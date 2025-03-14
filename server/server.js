const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

const port = process.env.PORT || 5000;

// POST route for generating questions based on topic and level
app.post("/generate-questions", (req, res) => {
  const { topic, level } = req.body;

  if (!topic || !level) {
    return res
      .status(400)
      .json({ error: "Topic and level are required fields" });
  }

  console.log(
    `Received request to generate quiz: Topic: ${topic}, Level: ${level}`
  ); // Log request

  // Construct the command for Ollama (without --prompt)
  const ollamaCommand = `ollama run deepseek-r1:1.5b "Generate a ${level} level quiz with 5 questions on ${topic}."`;

  console.log(`Executing command: ${ollamaCommand}`);

  // Execute the command
  exec(ollamaCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Error generating questions", details: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res
        .status(500)
        .json({ error: "Error generating questions", details: stderr });
    }

    // If no error, return the generated questions to the frontend
    res.json({ questions: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
