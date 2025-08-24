import SpeakingTestSelector from "./components/SpeakingTestSelector";

export default function SpeakingPage() {
  return (
    <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 lg:py-8">
      <SpeakingTestSelector />
    </div>
  );
}

export const metadata = {
  title: "Bài thi Nói chuẩn quốc tế - E-Learn English",
  description:
    "Luyện thi nói TOEIC, TOEFL, IELTS với hệ thống chấm điểm chuẩn như bài thi thật",
};
