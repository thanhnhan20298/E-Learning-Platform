import { apiRequest, API_ENDPOINTS } from "@/config/api";
import { ListeningExercise, ApiResponse } from "@/types";

/**
 * ListeningService - Service layer để quản lý các bài tập luyện nghe
 * Cung cấp các phương thức để tải, tạo và nộp bài tập listening
 */
export class ListeningService {
  /**
   * Lấy tất cả bài tập luyện nghe từ server
   * @returns Promise<ListeningExercise[]> - Danh sách các bài tập luyện nghe
   */
  static async getAllExercises(): Promise<ListeningExercise[]> {
    const data = await apiRequest<ApiResponse<ListeningExercise[]>>(
      API_ENDPOINTS.LISTENING
    );
    return data.success ? data.data : [];
  }

  /**
   * Tạo bài tập luyện nghe mới dựa trên chủ đề
   * @param topic - Chủ đề của bài tập (vd: "Shopping", "Job interview")
   * @param level - Mức độ khó (mặc định: "Intermediate")
   * @param questionCount - Số lượng câu hỏi (mặc định: 3)
   * @returns Promise<ListeningExercise> - Bài tập mới được tạo
   * @throws Error - Khi không thể tạo bài tập
   */
  static async generateExercise(
    topic: string,
    level: string = "Intermediate",
    questionCount: number = 3
  ): Promise<ListeningExercise> {
    const data = await apiRequest<ApiResponse<ListeningExercise>>(
      API_ENDPOINTS.LISTENING_GENERATE,
      {
        method: "POST",
        body: JSON.stringify({
          topic,
          level,
          questionCount,
        }),
      }
    );

    if (!data.success) {
      throw new Error("Failed to generate exercise");
    }

    return data.data;
  }

  /**
   * Nộp bài và kiểm tra đáp án
   * @param exerciseId - ID của bài tập
   * @param answers - Mảng đáp án đã chọn
   * @returns Promise<any> - Kết quả chấm điểm và phản hồi
   */
  static async submitAnswers(
    exerciseId: string,
    answers: number[]
  ): Promise<any> {
    return await apiRequest(`${API_ENDPOINTS.LISTENING}/${exerciseId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  }
}
