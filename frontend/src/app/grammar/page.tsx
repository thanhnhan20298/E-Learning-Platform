import GrammarLessons from "./components/GrammarLessons";

export default function GrammarPage() {
  return (
    <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 lg:py-8">
      <GrammarLessons />
    </div>
  );
}

export const metadata = {
  title: "Ngữ Pháp - E-Learn English",
  description:
    "Học ngữ pháp tiếng Anh một cách có hệ thống với ví dụ thực tế và bài tập thực hành",
};
