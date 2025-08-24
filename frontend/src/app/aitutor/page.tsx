import AITutor from "./components/AITutor";

export default function AITutorPage() {
  return (
    <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 lg:py-8">
      <AITutor />
    </div>
  );
}

export const metadata = {
  title: "AI Tutor - E-Learn English",
  description:
    "Học tiếng Anh với trợ lý AI thông minh, nhận feedback tức thì về phát âm và ngữ pháp",
};
