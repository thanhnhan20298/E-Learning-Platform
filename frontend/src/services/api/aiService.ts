import { apiRequest, API_ENDPOINTS } from "@/config/api";
import { ChatMessage, ApiResponse } from "@/types";

/**
 * AIService - Service layer để xử lý các tương tác với AI
 * Cung cấp các phương thức để giao tiếp với AI chatbot, kiểm tra ngữ pháp, và text-to-speech
 */
export class AIService {
  /**
   * Gửi tin nhắn đến AI chatbot và nhận phản hồi
   * @param message - Tin nhắn của người dùng
   * @param context - Ngữ cảnh cuộc trò chuyện (mặc định: "english_tutor")
   * @returns Promise<string> - Phản hồi từ AI
   * @throws Error - Khi không thể nhận được phản hồi từ AI
   */
  static async sendMessage(
    message: string,
    context: string = "english_tutor"
  ): Promise<string> {
    const data = await apiRequest<ApiResponse<{ response: string }>>(
      API_ENDPOINTS.AI_CHAT,
      {
        method: "POST",
        body: JSON.stringify({ message, context }),
      }
    );

    if (!data.success) {
      throw new Error("Failed to get AI response");
    }

    return data.data?.response || "Sorry, I couldn't process your message.";
  }

  /**
   * Kiểm tra ngữ pháp của đoạn văn bản
   * @param text - Văn bản cần kiểm tra ngữ pháp
   * @returns Promise<any> - Kết quả kiểm tra ngữ pháp với các lỗi và gợi ý sửa
   */
  static async checkGrammar(text: string): Promise<any> {
    return await apiRequest(`${API_ENDPOINTS.AI_CHAT}/grammar-check`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Chuyển đổi văn bản thành giọng nói
   * @param text - Văn bản cần chuyển đổi
   * @param voice - Loại giọng nói (mặc định: "alloy")
   * @returns Promise<any> - File audio hoặc URL audio
   */
  static async textToSpeech(
    text: string,
    voice: string = "alloy"
  ): Promise<any> {
    return await apiRequest(`${API_ENDPOINTS.AI_CHAT}/tts`, {
      method: "POST",
      body: JSON.stringify({ text, voice }),
    });
  }
}
