"use client";

import React, { useState } from "react";
import StandardizedSpeakingTest from "./StandardizedSpeakingTest";
import type { TestType } from "./StandardizedSpeakingTest";

// Thông tin chi tiết về từng loại bài thi / Detailed test information
const TEST_INFO = {
  TOEIC: {
    name: "TOEIC Speaking Test",
    description:
      "Bài thi nói TOEIC đánh giá khả năng giao tiếp trong môi trường làm việc",
    duration: "20 phút",
    tasks: 6,
    scoreRange: "0-200",
    level: "Beginner to Advanced",
    focus: "Business Communication",
    features: [
      "Đọc to văn bản / Read text aloud",
      "Mô tả hình ảnh / Describe pictures",
      "Trả lời câu hỏi / Answer questions",
      "Đưa ra ý kiến / Express opinions",
      "Đề xuất giải pháp / Propose solutions",
    ],
  },
  TOEFL: {
    name: "TOEFL iBT Speaking",
    description:
      "Bài thi nói TOEFL iBT đánh giá khả năng giao tiếp trong môi trường học thuật",
    duration: "17 phút",
    tasks: 4,
    scoreRange: "0-30",
    level: "Intermediate to Advanced",
    focus: "Academic Communication",
    features: [
      "Nói độc lập / Independent speaking",
      "Đọc-Nghe-Nói tích hợp / Integrated speaking",
      "Tóm tắt bài giảng / Summarize lectures",
      "Phân tích thông tin học thuật / Analyze academic content",
    ],
  },
  IELTS: {
    name: "IELTS Speaking Test",
    description:
      "Bài thi nói IELTS đánh giá khả năng giao tiếp trong cuộc sống hằng ngày và học thuật",
    duration: "11-14 phút",
    tasks: 3,
    scoreRange: "1.0-9.0",
    level: "All levels",
    focus: "General & Academic English",
    features: [
      "Phỏng vấn cá nhân / Personal interview",
      "Nói dài về chủ đề / Long turn speaking",
      "Thảo luận trừu tượng / Abstract discussion",
      "Đánh giá toàn diện / Comprehensive assessment",
    ],
  },
};

export default function SpeakingTestSelector() {
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [customExercise, setCustomExercise] = useState<any>(null);

  // Form state cho generate
  const [generateForm, setGenerateForm] = useState({
    testType: "TOEIC" as TestType,
    topic: "",
    level: "intermediate" as "beginner" | "intermediate" | "advanced",
    exerciseType: "picture_description" as string,
    customContent: "",
  });

  // Các loại bài tập có thể generate
  const EXERCISE_TYPES = {
    TOEIC: [
      { value: "read_aloud", label: "Đọc to văn bản / Read Aloud" },
      {
        value: "picture_description",
        label: "Mô tả hình ảnh / Picture Description",
      },
      { value: "opinion_question", label: "Câu hỏi ý kiến / Opinion Question" },
      {
        value: "business_scenario",
        label: "Tình huống kinh doanh / Business Scenario",
      },
    ],
    TOEFL: [
      { value: "independent_speaking", label: "Independent Speaking" },
      { value: "campus_conversation", label: "Campus Conversation" },
      { value: "academic_lecture", label: "Academic Lecture Summary" },
      { value: "reading_listening", label: "Reading + Listening Integration" },
    ],
    IELTS: [
      { value: "part1_interview", label: "Part 1: Personal Interview" },
      { value: "part2_cue_card", label: "Part 2: Cue Card Topic" },
      { value: "part3_discussion", label: "Part 3: Abstract Discussion" },
      { value: "describe_experience", label: "Describe Personal Experience" },
    ],
  };

  // Hàm xử lý generate bài tập mới
  const handleGenerateExercise = async () => {
    setGenerateLoading(true);
    try {
      const response = await fetch("/api/speaking/generate-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateForm),
      });

      if (response.ok) {
        const exercise = await response.json();
        setCustomExercise(exercise);
        setShowGenerateForm(false);
        // Tự động chuyển sang chế độ luyện tập
        setSelectedTest(generateForm.testType);
      } else {
        alert("Có lỗi xảy ra khi tạo bài tập");
      }
    } catch (error) {
      console.error("Generate error:", error);
      alert("Có lỗi xảy ra khi tạo bài tập");
    } finally {
      setGenerateLoading(false);
    }
  };

  // Xử lý khi hoàn thành bài thi / Handle test completion
  const handleTestComplete = (scores: any) => {
    setTestResults(scores);
    setShowResults(true);
  };

  // Quay lại trang chọn bài thi / Return to test selection
  const handleBackToSelection = () => {
    setSelectedTest(null);
    setShowResults(false);
    setTestResults(null);
    setCustomExercise(null);
  };

  // Nếu đang trong bài thi / If in test mode
  if (selectedTest && !showResults) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToSelection}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Quay lại chọn bài thi / Back to test selection
          </button>
        </div>
        <StandardizedSpeakingTest
          testType={selectedTest}
          onTestComplete={handleTestComplete}
          customExercise={customExercise}
        />
      </div>
    );
  }

  // Giao diện chọn loại bài thi / Test selection interface
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bài thi nói chuẩn quốc tế / International Speaking Tests
        </h1>
        <p className="text-xl text-gray-600">
          Chọn loại bài thi phù hợp với mục tiêu của bạn / Choose the test that
          fits your goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {(
          Object.entries(TEST_INFO) as [TestType, typeof TEST_INFO.TOEIC][]
        ).map(([testType, info]) => (
          <div
            key={testType}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300"
          >
            {/* Header */}
            <div
              className={`p-6 text-white ${
                testType === "TOEIC"
                  ? "bg-green-600"
                  : testType === "TOEFL"
                  ? "bg-blue-600"
                  : "bg-purple-600"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{info.name}</h3>
              <p className="text-sm opacity-90">{info.description}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Test stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {info.tasks}
                  </div>
                  <div className="text-sm text-gray-600">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {info.duration}
                  </div>
                  <div className="text-sm text-gray-600">Thời gian</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">
                    Thang điểm:
                  </span>
                  <span className="font-bold text-blue-600">
                    {info.scoreRange}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Trình độ:</span>
                  <span className="text-gray-600">{info.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Trọng tâm:
                  </span>
                  <span className="text-gray-600">{info.focus}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Nội dung bài thi:
                </h4>
                <ul className="space-y-2">
                  {info.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action button */}
              <button
                onClick={() => setSelectedTest(testType)}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors duration-200 ${
                  testType === "TOEIC"
                    ? "bg-green-600 hover:bg-green-700"
                    : testType === "TOEFL"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Bắt đầu {testType} / Start {testType}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            So sánh các bài thi / Test Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Tiêu chí / Criteria
                </th>
                <th className="text-center p-4 font-semibold text-green-600">
                  TOEIC
                </th>
                <th className="text-center p-4 font-semibold text-blue-600">
                  TOEFL
                </th>
                <th className="text-center p-4 font-semibold text-purple-600">
                  IELTS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  Mục đích chính
                </td>
                <td className="p-4 text-center text-gray-600">
                  Công việc / Work
                </td>
                <td className="p-4 text-center text-gray-600">
                  Học thuật / Academic
                </td>
                <td className="p-4 text-center text-gray-600">
                  Đa mục đích / General
                </td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 font-medium text-gray-700">
                  Số lượng tasks
                </td>
                <td className="p-4 text-center text-gray-600">6</td>
                <td className="p-4 text-center text-gray-600">4</td>
                <td className="p-4 text-center text-gray-600">3</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">Thời gian</td>
                <td className="p-4 text-center text-gray-600">20 phút</td>
                <td className="p-4 text-center text-gray-600">17 phút</td>
                <td className="p-4 text-center text-gray-600">11-14 phút</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <td className="p-4 font-medium text-gray-700">Thang điểm</td>
                <td className="p-4 text-center text-gray-600">0-200</td>
                <td className="p-4 text-center text-gray-600">0-30</td>
                <td className="p-4 text-center text-gray-600">1.0-9.0</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-700">Độ khó</td>
                <td className="p-4 text-center text-gray-600">Trung bình</td>
                <td className="p-4 text-center text-gray-600">Khó</td>
                <td className="p-4 text-center text-gray-600">Thay đổi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Exercise Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-purple-800 mb-2">
            🎯 Tạo bài tập luyện nói / Generate Speaking Exercise
          </h3>
          <p className="text-purple-600">
            Tạo bài tập tùy chỉnh để luyện nói theo chủ đề bạn muốn
          </p>
        </div>

        {!showGenerateForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowGenerateForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ✨ Tạo bài tập mới / Create New Exercise
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Cấu hình bài tập / Exercise Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bài thi / Test Type
                  </label>
                  <select
                    value={generateForm.testType}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        testType: e.target.value as TestType,
                        exerciseType:
                          EXERCISE_TYPES[e.target.value as TestType][0].value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="TOEIC">TOEIC Speaking</option>
                    <option value="TOEFL">TOEFL iBT Speaking</option>
                    <option value="IELTS">IELTS Speaking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cấp độ / Level
                  </label>
                  <select
                    value={generateForm.level}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner / Cơ bản</option>
                    <option value="intermediate">
                      Intermediate / Trung cấp
                    </option>
                    <option value="advanced">Advanced / Nâng cao</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại bài tập / Exercise Type
                </label>
                <select
                  value={generateForm.exerciseType}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      exerciseType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {EXERCISE_TYPES[generateForm.testType].map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề / Topic (tùy chọn)
                </label>
                <input
                  type="text"
                  value={generateForm.topic}
                  onChange={(e) =>
                    setGenerateForm({ ...generateForm, topic: e.target.value })
                  }
                  placeholder="VD: Technology, Travel, Education, Business..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tùy chỉnh / Custom Content (tùy chọn)
                </label>
                <textarea
                  value={generateForm.customContent}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      customContent: e.target.value,
                    })
                  }
                  placeholder="Nhập nội dung cụ thể bạn muốn luyện tập..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleGenerateExercise}
                  disabled={generateLoading}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang tạo...
                    </span>
                  ) : (
                    "🚀 Tạo và bắt đầu luyện tập"
                  )}
                </button>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tips section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">
          💡 Lời khuyên khi chọn bài thi / Tips for choosing a test
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">
              Chọn TOEIC nếu:
            </h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Bạn cần chứng chỉ cho công việc</li>
              <li>• Tập trung vào giao tiếp thương mại</li>
              <li>• Muốn bài thi ngắn gọn</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">
              Chọn TOEFL nếu:
            </h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Bạn định du học Mỹ</li>
              <li>• Cần kỹ năng học thuật</li>
              <li>• Quen với môi trường máy tính</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">
              Chọn IELTS nếu:
            </h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Bạn định du học/định cư</li>
              <li>• Thích thi với giám khảo thật</li>
              <li>• Cần đánh giá toàn diện</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
