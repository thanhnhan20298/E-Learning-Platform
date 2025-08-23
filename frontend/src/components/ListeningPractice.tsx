"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Loader, Plus } from "lucide-react";

interface ListeningExercise {
  id: number;
  title: string;
  level: string;
  audioUrl: string | null;
  transcript: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  generated?: boolean;
}

export default function ListeningPractice() {
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newExerciseTopic, setNewExerciseTopic] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/listening");
      const data = await response.json();
      if (data.success) {
        setExercises(data.data);
        console.log("✅ Loaded exercises:", data.data.length);
      }
    } catch (error) {
      console.error("❌ Error loading exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlaying(false);
    }
  };

  const generateNewExercise = async () => {
    if (!newExerciseTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/listening/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: newExerciseTopic,
            level: "Intermediate",
            questionCount: 3,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setExercises((prev) => [...prev, data.data]);
        setCurrentExercise(exercises.length);
        setNewExerciseTopic("");
        setAnswers([]);
        setShowTranscript(false);
        console.log("✅ Generated new exercise:", data.data.title);
      }
    } catch (error) {
      console.error("❌ Error generating exercise:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentEx = exercises[currentExercise];

  const togglePlayPause = () => {
    if (currentEx?.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (currentEx?.transcript) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speakText(currentEx.transcript);
      }
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading listening exercises...</p>
        </div>
      </div>
    );
  }

  if (!currentEx) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">🎧 Listening Practice</h1>
          <p className="text-gray-600 mb-8">
            No exercises available. Create a new one!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              🤖 Generate New Exercise
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter topic (e.g., 'Shopping', 'Job interview')"
                value={newExerciseTopic}
                onChange={(e) => setNewExerciseTopic(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <button
                onClick={generateNewExercise}
                disabled={isGenerating || !newExerciseTopic.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin inline mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 inline mr-2" />
                    Generate Exercise
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          🎧 Listening Practice
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{currentEx.title}</h2>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-blue-100 text-blue-800">
                {currentEx.level}
              </span>
              {currentEx.generated && (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ml-2 bg-green-100 text-green-800">
                  🤖 AI Generated
                </span>
              )}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className={`w-12 h-12 text-white rounded-full flex items-center justify-center ${
                  isSpeaking
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPlaying || isSpeaking ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <div className="flex-1">
                {currentEx.audioUrl ? (
                  <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
                    <source src={currentEx.audioUrl} type="audio/mpeg" />
                  </audio>
                ) : (
                  <div className="text-sm">
                    <p className="text-blue-600 font-medium">
                      🔊 Text-to-Speech enabled
                    </p>
                    <p className="text-gray-500 text-xs">
                      Click play to hear the transcript
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {showTranscript ? "Hide" : "Show"} Transcript
              </button>
            </div>
          </div>

          {/* Transcript */}
          {showTranscript && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">📝 Transcript</h3>
              <p className="text-blue-800 whitespace-pre-line">
                {currentEx.transcript}
              </p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Questions</h3>
            {currentEx.questions.map((question, questionIndex) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium mb-3">
                  {questionIndex + 1}. {question.question}
                </h4>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() =>
                          handleAnswerSelect(questionIndex, optionIndex)
                        }
                        className="text-blue-600"
                      />
                      <span>
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate New Exercise */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            🤖 Generate New Exercise
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter topic..."
              value={newExerciseTopic}
              onChange={(e) => setNewExerciseTopic(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              onClick={generateNewExercise}
              disabled={isGenerating || !newExerciseTopic.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
