import { SpeakingExercise, RecordingResult, ApiResponse } from "@/types";
import { apiRequest, API_ENDPOINTS } from "@/config/api";

/**
 * SpeakingService - Service layer để quản lý các bài tập luyện nói
 * Cung cấp dữ liệu bài tập, xử lý recording và phân tích phát âm
 */
export class SpeakingService {
  /**
   * Lấy danh sách các bài tập luyện nói từ server
   * @returns Promise<SpeakingExercise[]> - Danh sách bài tập luyện nói
   */
  static async getExercises(): Promise<SpeakingExercise[]> {
    const data = await apiRequest<ApiResponse<SpeakingExercise[]>>(
      API_ENDPOINTS.SPEAKING
    );
    return data.success ? data.data : [];
  }

  /**
   * Lấy một bài tập cụ thể theo ID
   * @param id - ID của bài tập
   * @returns Promise<SpeakingExercise> - Bài tập luyện nói
   */
  static async getExerciseById(id: number): Promise<SpeakingExercise> {
    const data = await apiRequest<ApiResponse<SpeakingExercise>>(
      `${API_ENDPOINTS.SPEAKING}/${id}`
    );

    if (!data.success) {
      throw new Error("Exercise not found");
    }

    return data.data;
  }

  /**
   * Xử lý và phân tích file ghi âm
   * @param audioBlob - File audio blob từ recording
   * @param targetText - Văn bản mục tiêu để so sánh
   * @param exerciseId - ID của bài tập (optional)
   * @returns Promise<RecordingResult> - Kết quả phân tích với điểm số và feedback
   */
  static async processRecording(
    audioBlob: Blob,
    targetText: string,
    exerciseId?: number
  ): Promise<RecordingResult> {
    // Tạo FormData để gửi file audio
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("targetText", targetText);
    if (exerciseId) {
      formData.append("exerciseId", exerciseId.toString());
    }

    const data = await apiRequest<ApiResponse<RecordingResult>>(
      API_ENDPOINTS.SPEAKING_ANALYZE,
      {
        method: "POST",
        body: formData,
        headers: {
          // Không set Content-Type, để browser tự động set cho FormData
        },
      }
    );

    if (!data.success) {
      throw new Error("Failed to analyze recording");
    }

    return data.data;
  }

  /**
   * Tạo bài tập luyện nói mới dựa trên chủ đề
   * @param topic - Chủ đề của bài tập (vd: "Shopping", "Restaurant")
   * @param level - Mức độ khó (mặc định: "Intermediate")
   * @param type - Loại bài tập (mặc định: "conversation")
   * @returns Promise<SpeakingExercise> - Bài tập mới được tạo
   */
  static async generateExercise(
    topic: string,
    level: string = "Intermediate",
    type: string = "conversation"
  ): Promise<SpeakingExercise> {
    const data = await apiRequest<ApiResponse<SpeakingExercise>>(
      API_ENDPOINTS.SPEAKING_GENERATE,
      {
        method: "POST",
        body: JSON.stringify({ topic, level, type }),
      }
    );

    if (!data.success) {
      throw new Error("Failed to generate exercise");
    }

    return data.data;
  }

  /**
   * Chuyển văn bản thành giọng nói sử dụng server TTS
   * @param text - Văn bản cần đọc
   * @param voice - Loại giọng nói (mặc định: "alloy")
   * @param speed - Tốc độ đọc (mặc định: 1.0)
   * @returns Promise<string> - URL của file audio
   */
  static async textToSpeech(
    text: string,
    voice: string = "alloy",
    speed: number = 1.0
  ): Promise<string> {
    const data = await apiRequest<ApiResponse<{ audioUrl: string }>>(
      API_ENDPOINTS.SPEAKING_TTS,
      {
        method: "POST",
        body: JSON.stringify({ text, voice, speed }),
      }
    );

    if (!data.success) {
      throw new Error("Failed to generate TTS");
    }

    return data.data.audioUrl;
  }

  /**
   * Chuyển văn bản thành giọng nói sử dụng Web Speech API (fallback)
   * Sử dụng khi server TTS không khả dụng
   * @param text - Văn bản cần đọc
   * @param options - Các tùy chọn về tốc độ, cao độ, âm lượng
   */
  static textToSpeechLocal(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): void {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 0.8; // Tốc độ đọc
      utterance.pitch = options?.pitch || 1; // Cao độ giọng
      utterance.volume = options?.volume || 1; // Âm lượng

      if (options?.onStart) {
        utterance.onstart = options.onStart;
      }

      if (options?.onEnd) {
        utterance.onend = options.onEnd;
      }

      speechSynthesis.speak(utterance);
    }
  }

  /**
   * Dừng speech synthesis hiện tại
   */
  static stopSpeech(): void {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }
}
