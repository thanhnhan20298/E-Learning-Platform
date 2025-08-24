const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for audio files
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"), false);
    }
  },
});

/**
 * Mock speaking exercises data
 * Trong thực tế sẽ lưu trong database
 */
const speakingExercises = [
  {
    id: 1,
    title: "Phát âm từ cơ bản",
    type: "pronunciation",
    level: "Beginner",
    targetText: "Hello, how are you today?",
    phonetic: "/həˈloʊ, haʊ ɑr ju təˈdeɪ/",
    tips: [
      "Chú ý âm 'h' trong 'Hello' - thở ra nhẹ",
      "Âm 'ow' trong 'how' phát âm như /aʊ/",
      "Âm cuối 'today' có stress mạnh",
    ],
    audioUrl: null, // Có thể thêm audio mẫu sau
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Đọc đoạn văn ngắn",
    type: "reading",
    level: "Intermediate",
    targetText:
      "The weather is beautiful today. I love walking in the park when the sun is shining brightly.",
    tips: [
      "Đọc chậm và rõ ràng",
      "Chú ý intonation cuối câu",
      "Pause giữa các câu",
    ],
    audioUrl: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Hội thoại thực tế",
    type: "conversation",
    level: "Intermediate",
    targetText:
      "Hi, I'd like to order a coffee please. Can I have a large cappuccino with extra foam?",
    tips: [
      "Sử dụng giọng điệu lịch sự",
      "Nhấn mạnh từ khóa: 'large', 'cappuccino', 'extra'",
      "Giọng lên cuối câu hỏi",
    ],
    audioUrl: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Nói tự do",
    type: "free_speech",
    level: "Advanced",
    targetText:
      "Tell me about your favorite hobby and why you enjoy it. Speak for 1-2 minutes.",
    tips: [
      "Nói tự nhiên, không cần hoàn hảo",
      "Sử dụng từ nối: first, then, because, however",
      "Thể hiện cảm xúc qua giọng nói",
    ],
    audioUrl: null,
    created_at: new Date().toISOString(),
  },
];

/**
 * GET /api/speaking
 * Lấy tất cả bài tập luyện nói
 */
router.get("/", (req, res) => {
  try {
    console.log("📚 Getting all speaking exercises");

    res.json({
      success: true,
      data: speakingExercises,
      message: `Found ${speakingExercises.length} speaking exercises`,
    });
  } catch (error) {
    console.error("❌ Error getting speaking exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get speaking exercises",
      error: error.message,
    });
  }
});

/**
 * GET /api/speaking/:id
 * Lấy một bài tập cụ thể
 */
router.get("/:id", (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const exercise = speakingExercises.find((ex) => ex.id === exerciseId);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    console.log(`📝 Getting speaking exercise ${exerciseId}`);

    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("❌ Error getting speaking exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get speaking exercise",
      error: error.message,
    });
  }
});

/**
 * POST /api/speaking/analyze
 * Phân tích file ghi âm và trả về kết quả
 */
router.post("/analyze", upload.single("audio"), async (req, res) => {
  try {
    const { targetText, exerciseId } = req.body;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "No audio file provided",
      });
    }

    if (!targetText) {
      return res.status(400).json({
        success: false,
        message: "Target text is required",
      });
    }

    console.log("🎤 Analyzing audio for speaking exercise");
    console.log(`Target text: ${targetText}`);
    console.log(`Audio file size: ${audioFile.size} bytes`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock speech recognition and analysis
    const analysisResult = {
      transcript: generateMockTranscript(targetText),
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      pronunciation_score: Math.random() * 20 + 80, // 80-100
      feedback: generateMockFeedback(),
      detailed_analysis: {
        pronunciation: Math.random() * 20 + 80,
        fluency: Math.random() * 20 + 80,
        intonation: Math.random() * 15 + 75,
        accuracy: Math.random() * 25 + 75,
      },
      processed_at: new Date().toISOString(),
    };

    console.log("✅ Audio analysis completed");

    res.json({
      success: true,
      data: analysisResult,
      message: "Audio analysis completed successfully",
    });
  } catch (error) {
    console.error("❌ Error analyzing audio:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze audio",
      error: error.message,
    });
  }
});

/**
 * POST /api/speaking/generate
 * Tạo bài tập luyện nói mới dựa trên prompt
 */
router.post("/generate", async (req, res) => {
  try {
    const { topic, level = "Intermediate", type = "conversation" } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    console.log(`🤖 Generating speaking exercise for topic: ${topic}`);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate new exercise based on topic
    const newExercise = {
      id: speakingExercises.length + 1,
      title: `${topic} - Speaking Practice`,
      type: type,
      level: level,
      targetText: generateTargetText(topic, type),
      tips: generateTips(topic, type),
      audioUrl: null,
      generated: true,
      topic: topic,
      created_at: new Date().toISOString(),
    };

    // Add to mock database
    speakingExercises.push(newExercise);

    console.log("✅ Generated new speaking exercise");

    res.json({
      success: true,
      data: newExercise,
      message: "Speaking exercise generated successfully",
    });
  } catch (error) {
    console.error("❌ Error generating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate speaking exercise",
      error: error.message,
    });
  }
});

/**
 * POST /api/speaking/tts
 * Text-to-Speech endpoint (placeholder)
 */
router.post("/tts", async (req, res) => {
  try {
    const { text, voice = "alloy", speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    console.log(`🔊 TTS request for text: ${text.substring(0, 50)}...`);

    // In real implementation, integrate with OpenAI TTS or similar
    // For now, return mock response
    res.json({
      success: true,
      data: {
        audioUrl: null, // Would be actual audio file URL
        text: text,
        voice: voice,
        speed: speed,
        message: "TTS generation completed (mock)",
      },
    });
  } catch (error) {
    console.error("❌ Error in TTS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate TTS",
      error: error.message,
    });
  }
});

// Helper functions

/**
 * Tạo transcript giả lập
 */
function generateMockTranscript(targetText) {
  const variations = [
    targetText,
    targetText.toLowerCase(),
    targetText.replace(/[.,!?]/g, ""),
    targetText.replace(/\s+/g, " ").trim(),
  ];

  return variations[Math.floor(Math.random() * variations.length)];
}

/**
 * Tạo feedback ngẫu nhiên
 */
function generateMockFeedback() {
  const feedbacks = [
    "Excellent pronunciation! Your intonation is natural and clear.",
    "Great job! Your speech is very understandable with good rhythm.",
    "Good effort! Try to focus on consonant clarity for better results.",
    "Nice work! Pay attention to word stress and sentence intonation.",
    "Well done! Your fluency is improving. Keep practicing linking sounds.",
    "Solid performance! Work on maintaining consistent volume and pace.",
  ];

  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

/**
 * Tạo target text dựa trên topic và type
 */
function generateTargetText(topic, type) {
  const templates = {
    pronunciation: {
      shopping:
        "I would like to buy some groceries. Where is the checkout counter?",
      restaurant:
        "Could I have the menu, please? I'd like to order the chicken pasta.",
      travel: "Excuse me, how do I get to the airport? Is there a shuttle bus?",
      work: "Good morning! I have a meeting scheduled at nine o'clock today.",
    },
    conversation: {
      shopping:
        "Hi, I'm looking for a birthday gift for my friend. Could you help me find something nice?",
      restaurant:
        "Good evening! Do you have a table for two? We'd prefer something by the window if possible.",
      travel:
        "Hello, I'd like to book a flight to New York. What are the available options for next week?",
      work: "I'd like to discuss the project timeline. When would be a good time for you to meet?",
    },
    reading: {
      shopping:
        "Shopping for groceries can be both fun and challenging. It's important to make a list before you go to avoid buying unnecessary items.",
      restaurant:
        "Dining out is one of life's great pleasures. A good restaurant provides not just delicious food, but also excellent service and atmosphere.",
      travel:
        "Traveling opens our minds to new experiences and cultures. Whether you prefer adventure or relaxation, there's a perfect destination waiting for you.",
      work: "Professional communication is essential in today's workplace. Clear and respectful dialogue helps build strong working relationships.",
    },
    free_speech: {
      shopping:
        "Describe your last shopping experience. What did you buy and how was the service?",
      restaurant:
        "Tell me about your favorite restaurant. What makes it special and what do you usually order?",
      travel:
        "Share a memorable travel experience. Where did you go and what made it unforgettable?",
      work: "Describe your ideal work environment. What factors make you most productive and happy at work?",
    },
  };

  const topicLower = topic.toLowerCase();
  const typeTemplates = templates[type] || templates.conversation;

  // Find matching template or use default
  for (const key in typeTemplates) {
    if (topicLower.includes(key)) {
      return typeTemplates[key];
    }
  }

  // Default fallback
  return `Practice speaking about ${topic}. Express your thoughts clearly and naturally.`;
}

/**
 * Tạo tips dựa trên topic và type
 */
function generateTips(topic, type) {
  const generalTips = {
    pronunciation: [
      "Speak slowly and clearly",
      "Focus on individual sounds",
      "Practice difficult words separately",
    ],
    conversation: [
      "Use natural intonation",
      "Pause between ideas",
      "Make eye contact (imagine you're talking to someone)",
    ],
    reading: [
      "Read with expression",
      "Pause at punctuation marks",
      "Vary your pace for emphasis",
    ],
    free_speech: [
      "Think before you speak",
      "Use connecting words (first, then, because)",
      "Don't worry about being perfect",
    ],
  };

  return generalTips[type] || generalTips.conversation;
}

/**
 * POST /speaking/generate-custom
 * Tạo bài tập speaking tùy chỉnh theo yêu cầu của user
 * Generate custom speaking exercise based on user requirements
 */
router.post("/generate-custom", async (req, res) => {
  try {
    const { testType, topic, level, exerciseType, customContent } = req.body;

    // Validate input
    if (!testType || !level || !exerciseType) {
      return res.status(400).json({
        error: "Missing required fields: testType, level, exerciseType",
      });
    }

    // Generate exercise based on type and topic
    const customExercise = await generateCustomExercise({
      testType,
      topic,
      level,
      exerciseType,
      customContent,
    });

    res.json({
      success: true,
      exercise: customExercise,
      metadata: {
        testType,
        level,
        exerciseType,
        topic,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating custom exercise:", error);
    res.status(500).json({
      error: "Failed to generate custom exercise",
      details: error.message,
    });
  }
});

/**
 * Tạo bài tập tùy chỉnh dựa trên tham số đầu vào
 * Generate custom exercise based on input parameters
 */
async function generateCustomExercise({
  testType,
  topic,
  level,
  exerciseType,
  customContent,
}) {
  // Exercise templates based on test type and exercise type
  const exerciseTemplates = {
    TOEIC: {
      read_aloud: {
        instruction: "Read the following text aloud as naturally as possible.",
        preparationTime: 45,
        responseTime: 45,
        content: generateReadAloudContent(topic, level, customContent),
      },
      picture_description: {
        instruction: "Describe the picture in as much detail as possible.",
        preparationTime: 30,
        responseTime: 45,
        content: generatePictureDescription(topic, level, customContent),
      },
      opinion_question: {
        instruction:
          "Give your opinion on the following question and explain your reasoning.",
        preparationTime: 15,
        responseTime: 60,
        content: generateOpinionQuestion(topic, level, customContent),
      },
      business_scenario: {
        instruction:
          "You are in a business meeting. Respond to the following situation.",
        preparationTime: 30,
        responseTime: 60,
        content: generateBusinessScenario(topic, level, customContent),
      },
    },
    TOEFL: {
      independent_speaking: {
        instruction:
          "Choose a position and explain your choice with reasons and examples.",
        preparationTime: 15,
        responseTime: 45,
        content: generateIndependentQuestion(topic, level, customContent),
      },
      campus_conversation: {
        instruction:
          "Summarize the conversation and give your opinion on the student's problem.",
        preparationTime: 20,
        responseTime: 60,
        content: generateCampusScenario(topic, level, customContent),
      },
      academic_lecture: {
        instruction: "Summarize the main points from the lecture.",
        preparationTime: 20,
        responseTime: 60,
        content: generateAcademicContent(topic, level, customContent),
      },
    },
    IELTS: {
      part1_interview: {
        instruction:
          "Answer the following questions about yourself and your experiences.",
        preparationTime: 0,
        responseTime: 60,
        content: generatePart1Questions(topic, level, customContent),
      },
      part2_cue_card: {
        instruction:
          "Speak about the topic on the cue card. You have 1 minute to prepare.",
        preparationTime: 60,
        responseTime: 120,
        content: generateCueCard(topic, level, customContent),
      },
      part3_discussion: {
        instruction: "Discuss the following questions in detail.",
        preparationTime: 0,
        responseTime: 180,
        content: generatePart3Questions(topic, level, customContent),
      },
    },
  };

  const template = exerciseTemplates[testType]?.[exerciseType];
  if (!template) {
    throw new Error(
      `Unsupported exercise type: ${exerciseType} for test type: ${testType}`
    );
  }

  return {
    id: `custom-${Date.now()}`,
    testType,
    exerciseType,
    level,
    topic,
    instruction: template.instruction,
    preparationTime: template.preparationTime,
    responseTime: template.responseTime,
    content: template.content,
    scoringCriteria: getScoringCriteria(testType, exerciseType),
    tips: generateTipsForExercise(testType, exerciseType, level),
  };
}

// Helper functions để generate nội dung cho từng loại bài tập
function generateReadAloudContent(topic, level, customContent) {
  if (customContent) return customContent;

  const topics = {
    beginner: {
      technology:
        "Smartphones have changed how we communicate. People can now send messages instantly to anyone around the world.",
      travel:
        "Many people enjoy traveling to different countries. They like to experience new cultures and try local food.",
      education:
        "Students today use computers and tablets in their classrooms. Technology helps them learn more effectively.",
    },
    intermediate: {
      technology:
        "The rapid advancement of artificial intelligence is transforming various industries, from healthcare to finance, creating both opportunities and challenges for the workforce.",
      travel:
        "Sustainable tourism practices are becoming increasingly important as travelers seek authentic experiences while minimizing their environmental impact on local communities.",
      education:
        "Online learning platforms have revolutionized education accessibility, allowing students from diverse backgrounds to access quality instruction regardless of geographical limitations.",
    },
    advanced: {
      technology:
        "The proliferation of quantum computing technology represents a paradigm shift that could revolutionize cryptography, drug discovery, and complex problem-solving methodologies across multiple scientific disciplines.",
      travel:
        "The phenomenon of overtourism has prompted destinations worldwide to implement innovative crowd management strategies, balancing economic benefits with cultural preservation and environmental sustainability imperatives.",
      education:
        "The integration of personalized learning algorithms and adaptive assessment technologies is fundamentally reshaping pedagogical approaches, enabling customized educational experiences that accommodate individual learning styles and cognitive preferences.",
    },
  };

  return (
    topics[level]?.[topic] ||
    topics[level]?.technology ||
    "Practice reading this text with clear pronunciation and natural rhythm."
  );
}

function generatePictureDescription(topic, level, customContent) {
  if (customContent) return customContent;

  const descriptions = {
    beginner:
      "Imagine you see a picture of people in a modern office. Describe what you see: the people, their activities, the furniture, and the atmosphere.",
    intermediate:
      "You are looking at an image depicting a busy international airport terminal. Describe the scene in detail, including the people, their emotions, the architecture, and the overall environment.",
    advanced:
      "Analyze this complex workplace scenario showing a diverse team collaborating on a project. Describe the interpersonal dynamics, the work environment, technological tools being used, and the apparent organizational culture.",
  };

  return descriptions[level] || descriptions.intermediate;
}

function generateOpinionQuestion(topic, level, customContent) {
  if (customContent) return customContent;

  const questions = {
    beginner:
      "Do you think it's better to work in a big company or a small company? Why?",
    intermediate:
      "Some people believe that remote work is better than working in an office. What is your opinion? Provide specific reasons.",
    advanced:
      "To what extent do you agree that technological automation will ultimately benefit society more than it will harm employment opportunities? Justify your position with concrete examples.",
  };

  return questions[level] || questions.intermediate;
}

function generateBusinessScenario(topic, level, customContent) {
  if (customContent) return customContent;

  const scenarios = {
    beginner:
      "Your colleague is always late to meetings. How would you talk to them about this problem?",
    intermediate:
      "A client is unhappy with your company's service and wants a refund. How would you handle this situation professionally?",
    advanced:
      "Your team has missed an important project deadline, potentially jeopardizing a major client relationship. How would you address this crisis in a stakeholder meeting while proposing concrete solutions?",
  };

  return scenarios[level] || scenarios.intermediate;
}

function generateIndependentQuestion(topic, level, customContent) {
  if (customContent) return customContent;

  const questions = {
    beginner:
      "Do you prefer studying alone or with a group? Explain your preference.",
    intermediate:
      "Some people think students should choose their own courses, while others believe schools should decide. Which do you prefer and why?",
    advanced:
      "Do you believe that universities should prioritize practical job skills over theoretical knowledge in their curriculum? Support your position with specific examples and reasoning.",
  };

  return questions[level] || questions.intermediate;
}

function generateCampusScenario(topic, level, customContent) {
  if (customContent) return customContent;

  return "A student is talking to an advisor about changing majors. The student is worried about graduating on time. The advisor suggests taking summer courses. What do you think about this solution?";
}

function generateAcademicContent(topic, level, customContent) {
  if (customContent) return customContent;

  const content = {
    beginner:
      "Listen to a short lecture about climate change and its effects on polar bears. Summarize the main points.",
    intermediate:
      "A professor discusses the impact of social media on modern communication patterns. Explain the key findings and their implications.",
    advanced:
      "An expert presents research on neuroplasticity and its applications in educational psychology. Synthesize the theoretical framework and practical applications discussed.",
  };

  return content[level] || content.intermediate;
}

function generatePart1Questions(topic, level, customContent) {
  if (customContent) return customContent;

  const questions = [
    "What is your hometown like?",
    "Do you enjoy cooking? Why or why not?",
    "How often do you use public transportation?",
    "What kind of music do you like?",
  ];

  return questions.join(" ");
}

function generateCueCard(topic, level, customContent) {
  if (customContent) return customContent;

  const cueCards = {
    beginner:
      "Describe a place you like to visit. You should say: where it is, how often you go there, what you do there, and explain why you like this place.",
    intermediate:
      "Describe a time when you had to learn something new. You should say: what you had to learn, why you needed to learn it, how you learned it, and explain how you felt about the experience.",
    advanced:
      "Describe a difficult decision you had to make recently. You should say: what the decision was, what options you considered, how you made the decision, and explain whether you think you made the right choice.",
  };

  return cueCards[level] || cueCards.intermediate;
}

function generatePart3Questions(topic, level, customContent) {
  if (customContent) return customContent;

  const questions = [
    "How has technology changed the way people learn?",
    "Do you think online education will replace traditional classrooms?",
    "What are the advantages and disadvantages of studying abroad?",
  ];

  return questions.join(" ");
}

function getScoringCriteria(testType, exerciseType) {
  const criteria = {
    TOEIC: [
      "Pronunciation",
      "Intonation",
      "Stress",
      "Grammar",
      "Vocabulary",
      "Content",
    ],
    TOEFL: ["Delivery", "Language Use", "Topic Development"],
    IELTS: [
      "Fluency and Coherence",
      "Lexical Resource",
      "Grammatical Range",
      "Pronunciation",
    ],
  };

  return criteria[testType] || criteria.IELTS;
}

function generateTipsForExercise(testType, exerciseType, level) {
  const tips = {
    TOEIC: {
      read_aloud: [
        "Read at a natural pace",
        "Pay attention to pronunciation",
        "Use appropriate intonation",
      ],
      picture_description: [
        "Start with an overview",
        "Describe details systematically",
        "Use present continuous tense",
      ],
      opinion_question: [
        "State your opinion clearly",
        "Give 2-3 supporting reasons",
        "Use examples",
      ],
      business_scenario: [
        "Be professional",
        "Show problem-solving skills",
        "Use business vocabulary",
      ],
    },
    TOEFL: {
      independent_speaking: [
        "Take a clear position",
        "Support with examples",
        "Organize your response",
      ],
      campus_conversation: [
        "Summarize the problem",
        "Explain the solutions",
        "Give your opinion",
      ],
      academic_lecture: [
        "Identify main points",
        "Explain relationships",
        "Use academic vocabulary",
      ],
    },
    IELTS: {
      part1_interview: [
        "Answer naturally",
        "Extend your answers",
        "Use varied vocabulary",
      ],
      part2_cue_card: [
        "Use all your preparation time",
        "Cover all bullet points",
        "Speak for the full 2 minutes",
      ],
      part3_discussion: [
        "Develop your ideas fully",
        "Use complex sentences",
        "Show critical thinking",
      ],
    },
  };

  return (
    tips[testType]?.[exerciseType] || [
      "Speak clearly",
      "Organize your thoughts",
      "Use appropriate vocabulary",
    ]
  );
}

module.exports = router;
