import { useState, useCallback, useRef, useEffect } from "react";
import { SpeakingService } from "@/services/api/speakingService";
import {
  AudioRecordingManager,
  SpeechSynthesisManager,
} from "@/services/business/audioManager";
import { TimerManager } from "@/services/business/utils";
import { SpeakingExercise, RecordingResult } from "@/types";

export const useSpeakingPractice = () => {
  const [exercises, setExercises] = useState<SpeakingExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingResult, setRecordingResult] =
    useState<RecordingResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Business logic managers
  const audioRecorderRef = useRef(new AudioRecordingManager());
  const speechSynthesisRef = useRef(new SpeechSynthesisManager());
  const timerRef = useRef(new TimerManager());

  const currentExercise = exercises[currentExerciseIndex];

  // Load exercises from API
  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const exerciseData = await SpeakingService.getExercises();
      setExercises(exerciseData);
      console.log("✅ Loaded speaking exercises:", exerciseData.length);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load exercises";
      setError(errorMessage);
      console.error("❌ Error loading speaking exercises:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate new exercise
  const generateExercise = useCallback(
    async (
      topic: string,
      level: string = "Intermediate",
      type: string = "conversation"
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const newExercise = await SpeakingService.generateExercise(
          topic,
          level,
          type
        );
        setExercises((prev) => [...prev, newExercise]);
        setCurrentExerciseIndex((prev) => prev + 1);
        // Reset after setting new exercise
        setRecordingResult(null);
        setShowResult(false);
        setRecordingTime(0);
        timerRef.current.reset();
        speechSynthesisRef.current.stop();
        setIsPlaying(false);

        console.log("✅ Generated new speaking exercise:", newExercise.title);
        return newExercise;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate exercise";
        setError(errorMessage);
        console.error("❌ Error generating speaking exercise:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetExercise = useCallback(() => {
    setRecordingResult(null);
    setShowResult(false);
    setRecordingTime(0);
    timerRef.current.reset();

    // Stop any ongoing audio
    speechSynthesisRef.current.stop();
    setIsPlaying(false);
  }, []);

  const selectExercise = useCallback(
    (index: number) => {
      if (index >= 0 && index < exercises.length) {
        setCurrentExerciseIndex(index);
        resetExercise();
      }
    },
    [exercises.length, resetExercise]
  );

  const processRecording = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      setError(null);
      try {
        const result = await SpeakingService.processRecording(
          audioBlob,
          currentExercise.targetText,
          currentExercise.id
        );
        setRecordingResult(result);
        setShowResult(true);
        console.log("✅ Recording processed successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process recording";
        setError(errorMessage);
        console.error("❌ Error processing recording:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [currentExercise?.targetText, currentExercise?.id]
  );

  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      setShowResult(false);
      setRecordingTime(0);
      setError(null);

      // Setup recording completion handler
      audioRecorderRef.current.onRecordingComplete((audioBlob) => {
        processRecording(audioBlob);
      });

      // Start recording and timer
      await audioRecorderRef.current.startRecording();
      timerRef.current.start((seconds: number) => {
        setRecordingTime(seconds);
      });

      console.log("🎤 Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
      setError("Cannot access microphone. Please check permissions.");
    }
  }, [processRecording]);

  const stopRecording = useCallback(() => {
    if (isRecording) {
      audioRecorderRef.current.stopRecording();
      timerRef.current.stop();
      setIsRecording(false);
      console.log("⏹️ Recording stopped");
    }
  }, [isRecording]);

  const playTargetAudio = useCallback(() => {
    if (!currentExercise) return;

    speechSynthesisRef.current.speak(currentExercise.targetText, {
      rate: 0.8,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
    });
  }, [currentExercise]);

  const stopAudio = useCallback(() => {
    speechSynthesisRef.current.stop();
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const speechSynthesis = speechSynthesisRef.current;
    const audioRecorder = audioRecorderRef.current;
    const timer = timerRef.current;

    return () => {
      speechSynthesis.stop();
      if (audioRecorder.isRecording()) {
        audioRecorder.stopRecording();
      }
      timer.reset();
    };
  }, []);

  // Load exercises on mount
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return {
    exercises,
    currentExercise,
    currentExerciseIndex,
    isLoading,
    isRecording,
    isPlaying,
    isProcessing,
    recordingTime,
    recordingResult,
    showResult,
    error,
    loadExercises,
    generateExercise,
    selectExercise,
    startRecording,
    stopRecording,
    playTargetAudio,
    stopAudio,
    resetExercise,
  };
};
