const express = require("express");
const router = express.Router();

// Use Gemini AI (Google - miễn phí)
const { GoogleGenerativeAI } = require("@google/generative-ai");
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Backup: OpenAI (nếu muốn dùng)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const { OpenAI } = require("openai");
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// AI Chat Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, context = "english_tutor" } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const systemPrompts = {
      english_tutor: `You are an expert English tutor. Help users improve their English by:
        - Correcting grammar mistakes
        - Suggesting better vocabulary
        - Explaining language rules
        - Providing pronunciation tips
        - Being encouraging and supportive
        Always respond in Vietnamese for explanations, but provide English examples.`,

      pronunciation: `You are a pronunciation coach. Help users with:
        - IPA phonetic transcriptions
        - Breaking down difficult sounds
        - Providing practice tips
        - Comparing sounds to Vietnamese when helpful`,

      conversation: `You are a conversation partner. Help users practice:
        - Natural dialogue
        - Appropriate responses
        - Cultural context
        - Idiomatic expressions`,
    };

    let aiResponse;

    if (gemini) {
      // Use Gemini AI (ưu tiên)
      const prompt = `${
        systemPrompts[context] || systemPrompts.english_tutor
      }\n\nUser: ${message}\n\nResponse:`;

      const result = await gemini.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();
    } else if (openai) {
      // Fallback to OpenAI if available
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompts[context] || systemPrompts.english_tutor,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      aiResponse = completion.choices[0].message.content;
    } else {
      // Use mock response if no AI service is available
      const mockResponses = [
        `Tuyệt vời! Câu "${message}" của bạn có cấu trúc đúng. Hãy thử thêm một số tính từ để làm cho câu sinh động hơn.`,
        `Tôi nhận thấy bạn đang học tốt! Về câu "${message}", hãy chú ý đến thì trong tiếng Anh. Bạn có muốn tôi giải thích thêm không?`,
        `Phát âm rất quan trọng! Với từ bạn vừa gõ, hãy chú ý đến âm cuối. Bạn có muốn luyện tập thêm không?`,
        `Từ vựng của bạn đã khá tốt! Hãy thử sử dụng từ "${message}" trong một câu hoàn chỉnh để tôi có thể góp ý thêm.`,
        `Tôi hiểu ý bạn muốn nói! Hãy thử diễn đạt bằng cách khác để tăng vốn từ vựng nhé.`,
      ];
      aiResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        context,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Text-to-Speech Endpoint (future implementation)
router.post("/tts", async (req, res) => {
  try {
    const { text, voice = "alloy" } = req.body;

    // Placeholder for TTS implementation
    res.json({
      success: true,
      message: "TTS feature coming soon",
      data: { text, voice },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({
      success: false,
      message: "TTS service unavailable",
    });
  }
});

// Grammar Check Endpoint
router.post("/grammar-check", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a grammar checker. Analyze the given text and:
            1. Identify grammar mistakes
            2. Suggest corrections
            3. Explain the rules
            4. Rate the overall grammar (1-10)
            
            Respond in JSON format:
            {
              "score": number,
              "corrections": [{"original": "text", "corrected": "text", "explanation": "reason"}],
              "overall_feedback": "general feedback"
            }`,
        },
        {
          role: "user",
          content: `Please check this text: "${text}"`,
        },
      ],
      max_tokens: 600,
      temperature: 0.3,
    });

    let analysisResult;
    try {
      analysisResult = JSON.parse(completion.choices[0].message.content);
    } catch {
      analysisResult = {
        score: 8,
        corrections: [],
        overall_feedback: completion.choices[0].message.content,
      };
    }

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Grammar Check Error:", error);
    res.status(500).json({
      success: false,
      message: "Grammar check failed",
    });
  }
});

module.exports = router;
