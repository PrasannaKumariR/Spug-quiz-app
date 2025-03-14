import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    setLoading(true);
    setError("");
    const prompt = `
    Create multiple-choice quiz on "${topic}" with ${numQuestions} questions with valid answer`;
    try {
      const response = await axios.post("http://127.0.0.1:11434/api/generate", {
        model: "deepseek-r1:1.5b",
        prompt: prompt,
        stream: false,
      });
      console.log(response);
      setQuiz(response.data.response);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate quiz. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", boxSizing: "border-box", height: "100vh" }}>
      {/* Main Content */}
      <div style={{ padding: "20px", width: "100%", maxWidth: "800px" }}>
        <div style={{ margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            AI Quiz Generator (DeepSeek-R1)
          </h2>

          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="topic"
              style={{ display: "block", fontWeight: "bold" }}
            >
              Enter Topic
            </label>
            <input
              id="topic"
              type="text"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="numQuestions"
              style={{ display: "block", fontWeight: "bold" }}
            >
              Number of Questions
            </label>
            <input
              type="number"
              min="1"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="difficulty"
              style={{ display: "block", fontWeight: "bold" }}
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <button
              onClick={generateQuiz}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0f3640",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {/* Generated Quiz Questions */}
          <div
            style={{
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              whiteSpace: "pre-wrap",
              textAlign: "left",
              overflowY: "auto", // Enables vertical scrolling if content exceeds height
              maxHeight: "198px", // Limit the height to fit content within this box
              width: "100%", // Make sure the width is responsive to the parent container
              boxSizing: "border-box", // Ensures padding and borders are included in element's total width and height
            }}
          >
            <pre>{quiz}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
