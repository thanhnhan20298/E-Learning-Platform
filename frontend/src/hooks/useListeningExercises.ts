import { useState, useEffect, useCallback, useRef } from "react";
import { ListeningService } from "@/services/api/listeningService";
import { SpeechSynthesisManager } from "@/services/business/audioManager";
import { ListeningExercise } from "@/types";

export const useListeningExercises = () => {
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Business logic managers
  const speechSynthesisRef = useRef(new SpeechSynthesisManager());
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentExercise = exercises[currentExerciseIndex];

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ListeningService.getAllExercises();
      setExercises(data);
      console.log("✅ Loaded exercises:", data.length);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load exercises";
      setError(errorMessage);
      console.error("❌ Error loading exercises:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateExercise = useCallback(
    async (topic: string, level: string = "Intermediate") => {
      setIsGenerating(true);
      setError(null);
      try {
        const newExercise = await ListeningService.generateExercise(
          topic,
          level,
          3
        );
        setExercises((prev) => [...prev, newExercise]);
        setCurrentExerciseIndex(exercises.length);
        setAnswers([]);
        setShowTranscript(false);
        console.log("✅ Generated new exercise:", newExercise.title);
        return newExercise;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate exercise";
        setError(errorMessage);
        console.error("❌ Error generating exercise:", err);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [exercises.length]
  );

  const selectExercise = useCallback(
    (index: number) => {
      if (index >= 0 && index < exercises.length) {
        setCurrentExerciseIndex(index);
        setAnswers([]);
        setShowTranscript(false);
        setIsPlaying(false);
        setIsSpeaking(false);

        // Stop any ongoing audio
        speechSynthesisRef.current.stop();
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    },
    [exercises.length]
  );

  const togglePlayPause = useCallback(() => {
    if (!currentExercise) return;

    if (currentExercise.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (currentExercise.transcript) {
      if (isSpeaking) {
        speechSynthesisRef.current.stop();
        setIsSpeaking(false);
        setIsPlaying(false);
      } else {
        speechSynthesisRef.current.speak(currentExercise.transcript, {
          rate: 0.8,
          onStart: () => {
            setIsSpeaking(true);
            setIsPlaying(true);
          },
          onEnd: () => {
            setIsSpeaking(false);
            setIsPlaying(false);
          },
        });
      }
    }
  }, [currentExercise, isPlaying, isSpeaking]);

  const toggleTranscript = useCallback(() => {
    setShowTranscript((prev) => !prev);
  }, []);

  const handleAnswerSelect = useCallback(
    (questionIndex: number, answerIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[questionIndex] = answerIndex;
        return newAnswers;
      });
    },
    []
  );

  const generateNewExercise = useCallback(
    (topic: string) => {
      return generateExercise(topic);
    },
    [generateExercise]
  );

  // Handle audio end event
  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Load exercises on mount
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    const speechSynthesis = speechSynthesisRef.current;
    const audioElement = audioRef.current;

    return () => {
      // Stop speech synthesis
      speechSynthesis.stop();

      // Stop HTML audio element
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      // Stop any global speech synthesis
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    exercises,
    currentExercise,
    currentExerciseIndex,
    loading,
    isGenerating,
    isPlaying,
    isSpeaking,
    showTranscript,
    answers,
    error,
    audioRef,
    loadExercises,
    generateExercise,
    selectExercise,
    togglePlayPause,
    toggleTranscript,
    handleAnswerSelect,
    generateNewExercise,
    handleAudioEnd,
  };
};
