const express = require("express");
const router = express.Router();

// Import Gemini AI để tạo bài nghe tự động
const { GoogleGenerativeAI } = require("@google/generative-ai");
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Sample listening exercises data
const sampleExercises = [
  {
    id: 1,
    title: "Daily Conversation - At the Coffee Shop",
    level: "Beginner",
    audioUrl: "/audio/coffee-shop.mp3",
    transcript:
      "Customer: Good morning! I'd like a large coffee, please.\nBarista: Would you like that black or with milk?\nCustomer: With milk, please. And could I have a muffin too?\nBarista: Sure! That'll be $6.50.",
    questions: [
      {
        id: 1,
        question: "What does the customer order?",
        options: [
          "A small coffee",
          "A large coffee and muffin",
          "Just a muffin",
          "Tea and cake",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "How much does the order cost?",
        options: ["$5.50", "$6.50", "$7.50", "$8.50"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Weather Forecast",
    level: "Intermediate",
    audioUrl: "/audio/weather.mp3",
    transcript:
      "Good evening, I'm Sarah Johnson with your weather update. Tomorrow will be partly cloudy with a high of 25 degrees Celsius. There's a 30% chance of rain in the afternoon, so you might want to bring an umbrella. The weekend looks much brighter with sunny skies and temperatures reaching 28 degrees.",
    questions: [
      {
        id: 1,
        question: "What will the weather be like tomorrow?",
        options: ["Sunny", "Partly cloudy", "Rainy", "Stormy"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What's the weekend weather forecast?",
        options: ["Rainy", "Cloudy", "Sunny", "Snowy"],
        correctAnswer: 2,
      },
    ],
  },
];

// Get all listening exercises
router.get("/", (req, res) => {
  try {
    const { level } = req.query;

    let exercises = sampleExercises;
    if (level) {
      exercises = sampleExercises.filter(
        (ex) => ex.level.toLowerCase() === level.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: exercises,
    });
  } catch (error) {
    console.error("Get listening exercises error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get listening exercises",
    });
  }
});

// Get specific listening exercise
router.get("/:id", (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const exercise = sampleExercises.find((ex) => ex.id === exerciseId);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Get listening exercise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get listening exercise",
    });
  }
});

// Submit answers and get results
router.post("/:id/submit", (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const { answers } = req.body;

    const exercise = sampleExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = exercise.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: isCorrect
          ? "Correct!"
          : `The correct answer is: ${
              question.options[question.correctAnswer]
            }`,
      };
    });

    const score = Math.round(
      (correctAnswers / exercise.questions.length) * 100
    );

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: exercise.questions.length,
        results,
        feedback:
          score >= 80
            ? "Excellent work!"
            : score >= 60
            ? "Good job! Keep practicing."
            : "Keep studying and try again!",
      },
    });
  } catch (error) {
    console.error("Submit listening answers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answers",
    });
  }
});

// Generate new listening exercise using AI
router.post("/generate", async (req, res) => {
  try {
    const { topic, level = "Intermediate", questionCount = 3 } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    if (gemini) {
      const prompt = `Create a listening comprehension exercise about "${topic}" for ${level} English learners.

Please create:
1. A realistic dialogue or monologue (50-100 words)
2. ${questionCount} multiple choice questions about the content
3. 4 options for each question with one correct answer

Format the response as JSON:
{
  "title": "Exercise title",
  "level": "${level}",
  "transcript": "The dialogue/monologue text",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Make sure the content is appropriate for ${level} level and engaging.`;

      const result = await gemini.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      // Try to parse AI response as JSON
      let exerciseData;
      try {
        // Remove markdown code blocks if present
        const cleanText = aiText.replace(/```json\n?|\n?```/g, "").trim();
        exerciseData = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Fallback to a basic structure
        exerciseData = {
          title: `${topic} - ${level} Exercise`,
          level,
          transcript: aiText,
          questions: [
            {
              question: "What is the main topic discussed?",
              options: [topic, "Weather", "Food", "Travel"],
              correctAnswer: 0,
            },
          ],
        };
      }

      // Add metadata
      exerciseData.id = Date.now();
      exerciseData.audioUrl = null; // Would need TTS integration
      exerciseData.generated = true;

      res.json({
        success: true,
        data: exerciseData,
      });
    } else {
      // Fallback when AI is not available
      res.json({
        success: true,
        data: {
          id: Date.now(),
          title: `${topic} - ${level} Exercise`,
          level,
          transcript: `This is a sample exercise about ${topic}. The content would be generated using AI when the API key is configured.`,
          questions: [
            {
              id: 1,
              question: `What is the main topic of this exercise?`,
              options: [topic, "General conversation", "Weather", "Shopping"],
              correctAnswer: 0,
            },
          ],
          generated: true,
          audioUrl: null,
        },
      });
    }
  } catch (error) {
    console.error("Generate listening exercise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate listening exercise",
    });
  }
});

module.exports = router;
