"use client";

import { useState } from "react";
import { Send, MessageSquare, Mic, Volume2 } from "lucide-react";

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Xin chào! Tôi là AI Tutor của bạn. Tôi có thể giúp bạn học tiếng Anh, sửa lỗi ngữ pháp, và luyện phát âm. Bạn muốn bắt đầu với điều gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");

    try {
      // Gọi API backend
      console.log("🚀 Calling API:", currentMessage);
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();
      console.log("✅ API Response:", data);

      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content:
          data.data?.response ||
          data.response ||
          data.message ||
          "Xin lỗi, tôi không thể phản hồi lúc này.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("❌ API Error:", error);
      // Fallback to mock response if API fails
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(currentMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Tuyệt vời! Câu của bạn có cấu trúc đúng. Hãy thử thêm một số tính từ để làm cho câu sinh động hơn.",
      'Tôi nhận thấy một lỗi nhỏ về ngữ pháp. Thay vì "was went", bạn nên sử dụng "went" hoặc "was going".',
      'Phát âm của bạn rất tốt! Hãy chú ý đến âm /th/ trong từ "think". Thử đặt lưỡi giữa răng.',
      "Bạn có muốn luyện tập với một số từ vựng mới không? Tôi có thể gợi ý một số chủ đề thú vị.",
      "Hãy thử diễn đạt ý tưởng này bằng cách khác. Có nhiều cách để nói cùng một điều trong tiếng Anh!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speech recognition
      setTimeout(() => {
        setInputMessage(
          "This is a transcribed message from speech recognition"
        );
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI English Tutor
          </h1>
          <p className="text-white/90">
            Trò chuyện với AI để cải thiện tiếng Anh của bạn
          </p>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  {message.type === "ai" && (
                    <button className="text-gray-500 hover:text-primary-600">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn hoặc sử dụng mic để nói..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {isRecording && (
            <div className="mt-3 flex items-center gap-2 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Đang ghi âm...</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t p-6 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Gợi ý câu hỏi:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Giúp tôi sửa lỗi ngữ pháp",
              "Luyện phát âm từ này",
              "Giải thích cấu trúc câu",
              "Gợi ý từ vựng mới",
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
