const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in .env
});
const openai = new OpenAIApi(configuration);

// Route to generate AI questions based on input
router.post('/generate-ai-question', authMiddleware, async (req, res) => {
  try {
    const { subject, numberOfQuestions } = req.body;

    // Prepare the prompt to send to OpenAI
    const prompt = `Generate ${numberOfQuestions} multiple-choice questions about ${subject}`;

    // Make the request to OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500, // Adjust based on your needs
    });

    // Extract generated questions
    const generatedQuestions = response.data.choices[0].text.trim();

    // Save the generated questions to your Question model
    const newQuestions = new Question({
      exam: req.body.examId, // Link to the exam
      questionText: generatedQuestions,
    });

    await newQuestions.save();

    res.send({
      message: 'AI Questions generated successfully',
      data: generatedQuestions,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
