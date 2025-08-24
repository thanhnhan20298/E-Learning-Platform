/**
 * TimerManager - Quản lý thời gian cho các bài tập có giới hạn thời gian
 * Cung cấp chức năng đếm thời gian và callback updates
 */
export class TimerManager {
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private timerInterval: NodeJS.Timeout | null = null;
  private onTick?: (seconds: number) => void;

  /**
   * Bắt đầu đếm thời gian
   * @param onTick - Callback function được gọi mỗi giây với số giây đã trôi qua
   */
  start(onTick?: (seconds: number) => void): void {
    this.onTick = onTick;
    this.startTime = Date.now();
    this.elapsedTime = 0;

    // Tạo interval để update mỗi giây
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.onTick) {
        this.onTick(this.elapsedTime);
      }
    }, 1000);
  }

  /**
   * Dừng timer và trả về thời gian đã trôi qua
   * @returns number - Số giây đã trôi qua
   */
  stop(): number {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    return this.elapsedTime;
  }

  /**
   * Reset timer về 0
   */
  reset(): void {
    this.stop();
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  /**
   * Lấy thời gian hiện tại đã trôi qua
   * @returns number - Số giây đã trôi qua
   */
  getElapsedTime(): number {
    return this.elapsedTime;
  }

  /**
   * Format thời gian thành dạng MM:SS
   * @param seconds - Số giây cần format
   * @returns string - Thời gian dạng "MM:SS"
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

/**
 * ScoreCalculator - Tính toán điểm số và tạo feedback cho bài tập speaking
 * Cung cấp các phương thức để đánh giá và phản hồi về pronunciation
 */
export class ScoreCalculator {
  /**
   * Tính điểm pronunciation dựa trên confidence và accuracy
   * @param confidence - Độ tin cậy từ speech recognition (0-1)
   * @param accuracy - Độ chính xác so với target text (0-1, mặc định: 1)
   * @returns number - Điểm số từ 0-100
   */
  static calculatePronunciationScore(
    confidence: number,
    accuracy: number = 1
  ): number {
    // Thuật toán tính điểm đơn giản
    const baseScore = confidence * 70; // 70% trọng số cho confidence
    const accuracyScore = accuracy * 30; // 30% trọng số cho accuracy
    return Math.min(100, Math.max(0, baseScore + accuracyScore));
  }

  /**
   * Lấy màu sắc CSS tương ứng với điểm số
   * @param score - Điểm số (0-100)
   * @returns string - CSS class cho màu
   */
  static getScoreColor(score: number): string {
    if (score >= 90) return "text-green-600"; // Xuất sắc - xanh lá
    if (score >= 80) return "text-yellow-600"; // Tốt - vàng
    if (score >= 70) return "text-orange-600"; // Khá - cam
    return "text-red-600"; // Cần cải thiện - đỏ
  }

  /**
   * Phân loại mức độ dựa trên điểm số
   * @param score - Điểm số (0-100)
   * @returns "excellent" | "good" | "fair" | "poor" - Mức độ đánh giá
   */
  static getScoreLevel(score: number): "excellent" | "good" | "fair" | "poor" {
    if (score >= 90) return "excellent"; // Xuất sắc
    if (score >= 80) return "good"; // Tốt
    if (score >= 70) return "fair"; // Khá
    return "poor"; // Cần cải thiện
  }

  /**
   * Tạo feedback dựa trên điểm số và level
   * @param score - Điểm số (0-100)
   * @param level - Mức độ của bài tập
   * @returns string - Feedback message
   */
  static generateFeedback(score: number, level: string): string {
    const scoreLevel = this.getScoreLevel(score);

    // Mapping feedback theo từng mức độ
    const feedbackMap = {
      excellent: [
        "Outstanding pronunciation! Your speech is clear and natural.",
        "Excellent work! Your intonation and rhythm are spot on.",
        "Perfect! Your pronunciation shows great mastery of English sounds.",
      ],
      good: [
        "Great job! Your pronunciation is very good with minor areas for improvement.",
        "Well done! Focus on stress patterns to reach the next level.",
        "Good pronunciation! Pay attention to linking sounds between words.",
      ],
      fair: [
        "Good effort! Work on individual sound clarity for better results.",
        "Keep practicing! Focus on vowel sounds and word stress.",
        "Fair pronunciation. Try slowing down and articulating more clearly.",
      ],
      poor: [
        "Keep practicing! Focus on basic sound pronunciation first.",
        "Don't give up! Start with shorter phrases and build up gradually.",
        "Practice needed. Listen to native speakers and repeat after them.",
      ],
    };

    const feedbacks = feedbackMap[scoreLevel];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }
}
