"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// Simple Button component
const Button: React.FC<{
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

// Định nghĩa các loại bài thi chuẩn / Standard test type definitions
export type TestType = "TOEIC" | "TOEFL" | "IELTS";

// Cấu trúc task cho từng loại bài thi / Task structures for each test type
interface TestTask {
  id: string;
  type: string;
  question: string;
  preparationTime: number; // giây / seconds
  responseTime: number; // giây / seconds
  instructions: string;
  additionalInfo?: string;
}

// Cấu hình chi tiết cho từng bài thi / Detailed configuration for each test
const TEST_CONFIGURATIONS = {
  TOEIC: {
    name: "TOEIC Speaking Test",
    totalTasks: 6,
    totalTime: 20 * 60, // 20 phút / 20 minutes
    scoringScale: { min: 0, max: 200 },
    tasks: [
      {
        id: "toeic-1",
        type: "Read a text aloud",
        question: "Please read the text aloud as naturally as possible.",
        preparationTime: 45,
        responseTime: 45,
        instructions:
          "You will have 45 seconds to prepare, then 45 seconds to read aloud.",
        additionalInfo: "Focus on pronunciation, intonation, and stress.",
      },
      {
        id: "toeic-2",
        type: "Describe a picture",
        question: "Describe the picture in as much detail as possible.",
        preparationTime: 30,
        responseTime: 45,
        instructions:
          "You will have 30 seconds to prepare, then 45 seconds to speak.",
        additionalInfo:
          "Include what you see, where it might be, and what people are doing.",
      },
      {
        id: "toeic-3",
        type: "Respond to questions",
        question:
          "You will answer 3 questions about daily life or work situations.",
        preparationTime: 0,
        responseTime: 15,
        instructions:
          "Listen to each question and respond immediately. You have 15 seconds per response.",
        additionalInfo: "Speak naturally and give complete answers.",
      },
      {
        id: "toeic-4",
        type: "Respond to questions using information",
        question: "Answer questions based on the provided information.",
        preparationTime: 30,
        responseTime: 15,
        instructions:
          "Study the information for 30 seconds, then answer 3 questions with 15 seconds each.",
        additionalInfo: "Use the information provided to support your answers.",
      },
      {
        id: "toeic-5",
        type: "Express an opinion",
        question: "Give your opinion on a specific topic and provide reasons.",
        preparationTime: 15,
        responseTime: 60,
        instructions:
          "You have 15 seconds to prepare, then 60 seconds to express your opinion.",
        additionalInfo:
          "State your opinion clearly and provide supporting reasons.",
      },
      {
        id: "toeic-6",
        type: "Propose a solution",
        question: "Listen to a problem and propose a solution.",
        preparationTime: 30,
        responseTime: 60,
        instructions:
          "Listen to the problem, prepare for 30 seconds, then speak for 60 seconds.",
        additionalInfo:
          "Acknowledge the problem and provide a practical solution.",
      },
    ],
  },
  TOEFL: {
    name: "TOEFL iBT Speaking Section",
    totalTasks: 4,
    totalTime: 17 * 60, // 17 phút / 17 minutes
    scoringScale: { min: 0, max: 30 },
    tasks: [
      {
        id: "toefl-1",
        type: "Independent Speaking Task",
        question: "Express and defend a personal choice from a given topic.",
        preparationTime: 15,
        responseTime: 45,
        instructions: "You have 15 seconds to prepare and 45 seconds to speak.",
        additionalInfo:
          "Choose one option and explain why you prefer it with specific examples.",
      },
      {
        id: "toefl-2",
        type: "Integrated Speaking - Read/Listen/Speak",
        question:
          "Read a campus announcement, listen to students discuss it, then summarize the situation.",
        preparationTime: 30,
        responseTime: 60,
        instructions:
          "Read for 50 seconds, listen to conversation, prepare for 30 seconds, speak for 60 seconds.",
        additionalInfo:
          "Summarize the announcement and the students' opinions about it.",
      },
      {
        id: "toefl-3",
        type: "Integrated Speaking - Read/Listen/Speak",
        question:
          "Read an academic passage, listen to a lecture, then explain how the lecture relates to the reading.",
        preparationTime: 30,
        responseTime: 60,
        instructions:
          "Read for 50 seconds, listen to lecture, prepare for 30 seconds, speak for 60 seconds.",
        additionalInfo:
          "Explain how the lecture examples relate to or contradict the reading passage.",
      },
      {
        id: "toefl-4",
        type: "Integrated Speaking - Listen/Speak",
        question:
          "Listen to an academic lecture and summarize the important information.",
        preparationTime: 20,
        responseTime: 60,
        instructions:
          "Listen to the lecture, prepare for 20 seconds, then speak for 60 seconds.",
        additionalInfo:
          "Summarize the main points and supporting details from the lecture.",
      },
    ],
  },
  IELTS: {
    name: "IELTS Speaking Test",
    totalTasks: 3,
    totalTime: 14 * 60, // 11-14 phút / 11-14 minutes
    scoringScale: { min: 1, max: 9 },
    tasks: [
      {
        id: "ielts-1",
        type: "Part 1: Introduction and Interview",
        question:
          "Answer questions about familiar topics such as home, family, work, studies and interests.",
        preparationTime: 0,
        responseTime: 240, // 4-5 phút / 4-5 minutes
        instructions:
          "The examiner will ask you questions about yourself and familiar topics.",
        additionalInfo:
          "Speak naturally and give extended answers with examples.",
      },
      {
        id: "ielts-2",
        type: "Part 2: Long Turn",
        question:
          "Speak for 1-2 minutes on a particular topic based on the task card.",
        preparationTime: 60,
        responseTime: 120, // 1-2 phút / 1-2 minutes
        instructions:
          "You have 1 minute to prepare and can make notes. Then speak for 1-2 minutes.",
        additionalInfo:
          "Cover all points on the task card and speak continuously.",
      },
      {
        id: "ielts-3",
        type: "Part 3: Discussion",
        question:
          "Discuss more abstract ideas and issues linked to the topic in Part 2.",
        preparationTime: 0,
        responseTime: 300, // 4-5 phút / 4-5 minutes
        instructions:
          "The examiner will ask you more complex questions related to Part 2 topic.",
        additionalInfo:
          "Give detailed answers, express opinions, and analyze issues in depth.",
      },
    ],
  },
};

// Hệ thống chấm điểm chi tiết / Detailed scoring system
const SCORING_CRITERIA = {
  TOEIC: {
    pronunciation: { weight: 25, description: "Pronunciation" },
    intonation: { weight: 25, description: "Intonation and Stress" },
    grammar: { weight: 25, description: "Grammar" },
    vocabulary: { weight: 25, description: "Vocabulary" },
  },
  TOEFL: {
    delivery: { weight: 25, description: "Delivery (clear speech, good pace)" },
    languageUse: {
      weight: 25,
      description: "Language Use (grammar and vocabulary)",
    },
    topicDevelopment: {
      weight: 50,
      description: "Topic Development (content and coherence)",
    },
  },
  IELTS: {
    fluency: { weight: 25, description: "Fluency and Coherence" },
    lexical: { weight: 25, description: "Lexical Resource" },
    grammar: { weight: 25, description: "Grammatical Range and Accuracy" },
    pronunciation: { weight: 25, description: "Pronunciation" },
  },
};

interface StandardizedSpeakingTestProps {
  testType: TestType;
  onTestComplete: (score: any) => void;
  customExercise?: any;
}

export default function StandardizedSpeakingTest({
  testType,
  onTestComplete,
  customExercise,
}: StandardizedSpeakingTestProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isPreparationTime, setIsPreparationTime] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [scores, setScores] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = customExercise
    ? {
        ...TEST_CONFIGURATIONS[testType],
        tasks: [
          {
            id: customExercise.id,
            type: customExercise.exerciseType,
            question: customExercise.content,
            preparationTime: customExercise.preparationTime,
            responseTime: customExercise.responseTime,
            instructions: customExercise.instruction,
            additionalInfo: customExercise.tips?.join(", "),
          },
        ],
      }
    : TEST_CONFIGURATIONS[testType];

  const currentTask = config.tasks[currentTaskIndex];

  // Tính toán điểm số / Calculate scores
  const calculateScores = useCallback(() => {
    const criteria = SCORING_CRITERIA[testType];
    const mockScores: Record<string, number> = {};

    Object.keys(criteria).forEach((criterion) => {
      if (testType === "IELTS") {
        mockScores[criterion] = Math.floor(Math.random() * 3) + 6;
      } else if (testType === "TOEFL") {
        mockScores[criterion] = Math.floor(Math.random() * 8) + 18;
      } else {
        mockScores[criterion] = Math.floor(Math.random() * 60) + 120;
      }
    });

    let overallScore: number;
    const scores = Object.values(mockScores) as number[];

    if (testType === "IELTS") {
      overallScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      overallScore = Math.round(overallScore * 2) / 2;
    } else {
      overallScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }

    const finalScores = {
      overall: overallScore,
      breakdown: mockScores,
      maxScore: config.scoringScale.max,
      minScore: config.scoringScale.min,
    };

    setScores(finalScores);
    onTestComplete(finalScores);
  }, [
    testType,
    config.scoringScale.max,
    config.scoringScale.min,
    onTestComplete,
  ]);

  // Hoàn thành bài thi / Complete test
  const completeTest = useCallback(() => {
    setTestCompleted(true);
    calculateScores();
  }, [calculateScores]);

  // Chuyển sang task tiếp theo / Move to next task
  const moveToNextTask = useCallback(() => {
    if (currentTaskIndex < config.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setIsPreparationTime(true);
      setTimeLeft(config.tasks[currentTaskIndex + 1].preparationTime);
    } else {
      completeTest();
    }
  }, [currentTaskIndex, config.tasks, completeTest]);

  // Bắt đầu ghi âm / Start recording
  const startRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  }, []);

  // Dừng ghi âm / Stop recording
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Xử lý khi hết thời gian / Handle time up
  const handleTimeUp = useCallback(() => {
    if (isPreparationTime) {
      setIsPreparationTime(false);
      setTimeLeft(currentTask.responseTime);
      startRecording();
    } else {
      stopRecording();
      moveToNextTask();
    }
  }, [
    isPreparationTime,
    currentTask.responseTime,
    startRecording,
    stopRecording,
    moveToNextTask,
  ]);

  // Khởi tạo thiết bị ghi âm / Initialize recording device
  useEffect(() => {
    const initializeRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          setRecordings((prev) => [...prev, audioBlob]);
          audioChunksRef.current = [];
        };
      } catch (error) {
        console.error("Lỗi khởi tạo ghi âm:", error);
      }
    };

    initializeRecording();

    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Quản lý thời gian / Time management
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted && !testCompleted) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, testStarted, testCompleted, handleTimeUp]);

  // Bắt đầu bài thi / Start test
  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(currentTask.preparationTime);
  };

  // Định dạng thời gian / Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Giao diện trước khi bắt đầu / Pre-test interface
  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {config.name}
          </h1>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Thông tin bài thi / Test Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <strong>Số lượng tasks:</strong> {config.totalTasks}
              </div>
              <div>
                <strong>Thời gian tổng:</strong>{" "}
                {Math.floor(config.totalTime / 60)} phút
              </div>
              <div>
                <strong>Thang điểm:</strong> {config.scoringScale.min} -{" "}
                {config.scoringScale.max}
              </div>
              <div>
                <strong>Loại bài thi:</strong> {testType}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Cấu trúc bài thi / Test Structure
          </h3>
          <div className="space-y-4">
            {config.tasks.map((task, index) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-600">
                    Task {index + 1}: {task.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    Prep: {formatTime(task.preparationTime)} | Response:{" "}
                    {formatTime(task.responseTime)}
                  </span>
                </div>
                <p className="text-gray-700">{task.instructions}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={startTest}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Bắt đầu bài thi / Start Test
          </Button>
        </div>
      </div>
    );
  }

  // Giao diện kết quả / Results interface
  if (testCompleted && scores) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Kết quả bài thi / Test Results
          </h1>
          <div className="text-6xl font-bold text-green-600 mb-4">
            {scores.overall}
            <span className="text-2xl text-gray-500">/{scores.maxScore}</span>
          </div>
          <p className="text-xl text-gray-600">{config.name}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Chi tiết điểm số / Score Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(SCORING_CRITERIA[testType]).map(
              ([key, criterion]: [string, any]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {criterion.description}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {scores.breakdown[key]}
                      {testType === "IELTS"
                        ? "/9.0"
                        : testType === "TOEFL"
                        ? "/30"
                        : "/200"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (scores.breakdown[key] / scores.maxScore) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Làm bài mới / Take New Test
          </Button>
        </div>
      </div>
    );
  }

  // Giao diện trong quá trình thi / Test interface
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header với thông tin tiến độ / Progress header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Task {currentTaskIndex + 1} of {config.totalTasks}
          </h2>
          <p className="text-blue-600">{currentTask.type}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-800">
            {formatTime(timeLeft)}
          </div>
          <p className="text-blue-600">
            {isPreparationTime ? "Thời gian chuẩn bị" : "Thời gian trả lời"}
          </p>
        </div>
      </div>

      {/* Trạng thái hiện tại / Current status */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center mb-4">
          {isPreparationTime ? (
            <div className="flex items-center text-yellow-600">
              <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold">Đang chuẩn bị / Preparing</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <div className="w-4 h-4 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold">
                {isRecording
                  ? "Đang ghi âm / Recording"
                  : "Sẵn sàng ghi âm / Ready to Record"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung task / Task content */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentTask.type}
        </h3>
        <p className="text-gray-700 mb-4">{currentTask.question}</p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-medium mb-2">
            Hướng dẫn / Instructions:
          </p>
          <p className="text-blue-700">{currentTask.instructions}</p>
          {currentTask.additionalInfo && (
            <p className="text-blue-600 text-sm mt-2 italic">
              {currentTask.additionalInfo}
            </p>
          )}
        </div>
      </div>

      {/* Điều khiển ghi âm / Recording controls */}
      {!isPreparationTime && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
            <div
              className={`w-6 h-6 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-lg font-medium">
              {isRecording ? "Đang ghi âm..." : "Chờ ghi âm..."}
            </span>
          </div>
        </div>
      )}

      {/* Tiến độ tổng thể / Overall progress */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Tiến độ bài thi / Test Progress</span>
          <span>
            {currentTaskIndex + 1} / {config.totalTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentTaskIndex + 1) / config.totalTasks) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
