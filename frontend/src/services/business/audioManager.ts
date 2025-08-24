/**
 * AudioRecordingManager - Quản lý việc ghi âm audio từ microphone
 * Sử dụng MediaRecorder API để capture và xử lý audio data
 */
export class AudioRecordingManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private onDataAvailable?: (blob: Blob) => void;

  /**
   * Bắt đầu ghi âm từ microphone
   * @throws Error - Khi không thể truy cập microphone
   */
  async startRecording(): Promise<void> {
    try {
      // Yêu cầu quyền truy cập microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      // Xử lý khi có dữ liệu audio
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      // Xử lý khi hoàn thành ghi âm
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        if (this.onDataAvailable) {
          this.onDataAvailable(audioBlob);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error("Cannot access microphone. Please check permissions.");
    }
  }

  /**
   * Dừng ghi âm và giải phóng tài nguyên
   */
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
      // Giải phóng microphone stream
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  /**
   * Kiểm tra trạng thái ghi âm
   * @returns boolean - true nếu đang ghi âm
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /**
   * Đăng ký callback khi hoàn thành ghi âm
   * @param callback - Function nhận audio blob khi ghi âm xong
   */
  onRecordingComplete(callback: (blob: Blob) => void): void {
    this.onDataAvailable = callback;
  }
}

/**
 * SpeechSynthesisManager - Quản lý text-to-speech
 * Sử dụng Web Speech API để chuyển đổi text thành giọng nói
 */
export class SpeechSynthesisManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Đọc văn bản thành giọng nói
   * @param text - Văn bản cần đọc
   * @param options - Các tùy chọn về tốc độ, cao độ, âm lượng và callbacks
   * @throws Error - Khi trình duyệt không hỗ trợ speech synthesis
   */
  speak(
    text: string,
    options?: {
      rate?: number; // Tốc độ đọc (0.1 - 10)
      pitch?: number; // Cao độ giọng (0 - 2)
      volume?: number; // Âm lượng (0 - 1)
      onStart?: () => void; // Callback khi bắt đầu đọc
      onEnd?: () => void; // Callback khi kết thúc đọc
    }
  ): void {
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech synthesis not supported");
    }

    // Dừng bất kỳ speech nào đang chạy
    this.stop();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.rate = options?.rate || 0.8;
    this.currentUtterance.pitch = options?.pitch || 1;
    this.currentUtterance.volume = options?.volume || 1;

    // Đăng ký các event handlers
    if (options?.onStart) {
      this.currentUtterance.onstart = options.onStart;
    }

    if (options?.onEnd) {
      this.currentUtterance.onend = options.onEnd;
    }

    speechSynthesis.speak(this.currentUtterance);
  }

  /**
   * Dừng speech synthesis hiện tại
   */
  stop(): void {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  /**
   * Kiểm tra trạng thái đang đọc
   * @returns boolean - true nếu đang đọc
   */
  isSpeaking(): boolean {
    return speechSynthesis.speaking;
  }
}
