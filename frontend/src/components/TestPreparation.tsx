'use client'

import { useState } from 'react'
import { Award, Clock, BookOpen, Target, CheckCircle, XCircle, Timer } from 'lucide-react'

interface TestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  skill: 'listening' | 'reading' | 'grammar' | 'vocabulary'
}

interface MockTest {
  id: number
  title: string
  type: 'TOEIC' | 'IELTS'
  duration: number // minutes
  totalQuestions: number
  questions: TestQuestion[]
  description: string
}

export default function TestPreparation() {
  const [selectedTest, setSelectedTest] = useState<number | null>(null)
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const mockTests: MockTest[] = [
    {
      id: 1,
      title: 'TOEIC Listening & Reading Sample Test',
      type: 'TOEIC',
      duration: 120,
      totalQuestions: 20,
      description: 'Bài thi thử TOEIC với 20 câu hỏi được chọn lọc từ các phần Listening và Reading',
      questions: [
        {
          id: 1,
          question: 'What time does the meeting start?',
          options: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
          correctAnswer: 1,
          explanation: 'Trong đoạn audio, người nói rõ ràng nói "The meeting will start at nine thirty".',
          skill: 'listening'
        },
        {
          id: 2,
          question: 'Choose the correct form: "I _____ in this company for five years."',
          options: ['work', 'worked', 'have worked', 'am working'],
          correctAnswer: 2,
          explanation: 'Với "for five years", ta dùng Present Perfect: "have worked".',
          skill: 'grammar'
        },
        {
          id: 3,
          question: 'What does "feasible" mean?',
          options: ['Impossible', 'Practical and achievable', 'Expensive', 'Temporary'],
          correctAnswer: 1,
          explanation: '"Feasible" có nghĩa là có thể thực hiện được, khả thi.',
          skill: 'vocabulary'
        },
        {
          id: 4,
          question: 'According to the passage, what is the main benefit of remote work?',
          options: ['Higher salary', 'Better work-life balance', 'More vacation days', 'Free meals'],
          correctAnswer: 1,
          explanation: 'Đoạn văn nhấn mạnh rằng lợi ích chính của làm việc từ xa là cân bằng tốt hơn giữa công việc và cuộc sống.',
          skill: 'reading'
        },
        {
          id: 5,
          question: 'The project _____ by the end of next month.',
          options: ['will complete', 'will be completed', 'will have completed', 'completes'],
          correctAnswer: 1,
          explanation: 'Dùng passive voice với "will be completed" vì dự án được hoàn thành (bởi ai đó).',
          skill: 'grammar'
        }
      ]
    },
    {
      id: 2,
      title: 'IELTS Academic Reading Sample',
      type: 'IELTS',
      duration: 60,
      totalQuestions: 15,
      description: 'Bài thi thử IELTS Academic Reading với 15 câu hỏi dạng True/False/Not Given và Multiple Choice',
      questions: [
        {
          id: 1,
          question: 'The research shows that climate change is accelerating.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 0,
          explanation: 'Đoạn văn có đề cập rõ ràng rằng nghiên cứu cho thấy biến đổi khí hậu đang tăng tốc.',
          skill: 'reading'
        },
        {
          id: 2,
          question: 'Which factor contributes most to global warming?',
          options: ['Deforestation', 'Industrial emissions', 'Transportation', 'Agriculture'],
          correctAnswer: 1,
          explanation: 'Theo đoạn văn, khí thải công nghiệp là yếu tố đóng góp nhiều nhất vào hiện tượng nóng lên toàn cầu.',
          skill: 'reading'
        },
        {
          id: 3,
          question: 'The author mentions that renewable energy is becoming cheaper.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 0,
          explanation: 'Tác giả có đề cập rằng năng lượng tái tạo đang trở nên rẻ hơn.',
          skill: 'reading'
        }
      ]
    }
  ]

  const startTest = (testId: number) => {
    const test = mockTests.find(t => t.id === testId)
    if (test) {
      setSelectedTest(testId)
      setIsTestStarted(true)
      setTimeLeft(test.duration * 60) // Convert to seconds
      setCurrentQuestion(0)
      setAnswers([])
      setShowResults(false)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    const test = mockTests.find(t => t.id === selectedTest)
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishTest()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishTest = () => {
    setShowResults(true)
    setIsTestStarted(false)
  }

  const getScore = () => {
    const test = mockTests.find(t => t.id === selectedTest)
    if (!test) return { correct: 0, total: 0, percentage: 0 }

    let correct = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })

    const percentage = Math.round((correct / test.questions.length) * 100)
    return { correct, total: test.questions.length, percentage }
  }

  const getTOEICScore = (percentage: number) => {
    // Rough TOEIC score conversion
    if (percentage >= 90) return '900-990'
    if (percentage >= 80) return '800-895'
    if (percentage >= 70) return '700-795'
    if (percentage >= 60) return '600-695'
    if (percentage >= 50) return '500-595'
    return '300-495'
  }

  const getIELTSBand = (percentage: number) => {
    // Rough IELTS band conversion
    if (percentage >= 90) return '8.5-9.0'
    if (percentage >= 80) return '7.5-8.0'
    if (percentage >= 70) return '6.5-7.0'
    if (percentage >= 60) return '6.0-6.5'
    if (percentage >= 50) return '5.5-6.0'
    return '4.0-5.0'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (showResults && selectedTest) {
    const test = mockTests.find(t => t.id === selectedTest)!
    const score = getScore()

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài thi</h1>
          <h2 className="text-xl text-gray-600 mb-6">{test.title}</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score.correct}/{score.total}</div>
              <div className="text-blue-800">Câu đúng</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{score.percentage}%</div>
              <div className="text-green-800">Tỷ lệ đúng</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {test.type === 'TOEIC' ? getTOEICScore(score.percentage) : getIELTSBand(score.percentage)}
              </div>
              <div className="text-purple-800">
                {test.type === 'TOEIC' ? 'Ước tính TOEIC' : 'Ước tính IELTS Band'}
              </div>
            </div>
          </div>

          <div className="text-left space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết câu trả lời:</h3>
            {test.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      Câu {index + 1}: {question.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Bạn chọn: {question.options[answers[index]] || 'Không trả lời'}
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      Đáp án đúng: {question.options[question.correctAnswer]}
                    </p>
                    <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                setSelectedTest(null)
                setShowResults(false)
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={() => startTest(selectedTest)}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Làm lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isTestStarted && selectedTest) {
    const test = mockTests.find(t => t.id === selectedTest)!
    const question = test.questions[currentQuestion]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">
                Câu {currentQuestion + 1} / {test.totalQuestions}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5 text-blue-600" />
                <span className="font-mono text-blue-600">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={finishTest}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.skill === 'listening' ? 'bg-purple-100 text-purple-800' :
                question.skill === 'reading' ? 'bg-blue-100 text-blue-800' :
                question.skill === 'grammar' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {question.skill.charAt(0).toUpperCase() + question.skill.slice(1)}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  answers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswer(index)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900 font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Câu trước
            </button>
            <button
              onClick={nextQuestion}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {currentQuestion === test.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tiến độ</span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestion + 1) / test.totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / test.totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Luyện Thi TOEIC & IELTS</h1>
        <p className="text-gray-600">Chuẩn bị tốt nhất cho kỳ thi của bạn với các bài thi thử chất lượng cao</p>
      </div>

      {/* Test Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {mockTests.map((test) => (
          <div key={test.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                test.type === 'TOEIC' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {test.type}
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-3">{test.title}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{test.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{test.duration} phút</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{test.totalQuestions} câu</span>
              </div>
            </div>
            
            <button
              onClick={() => startTest(test.id)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Bắt đầu thi thử
            </button>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mẹo làm bài thi hiệu quả</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">TOEIC Tips:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Đọc kỹ đề trước khi nghe audio</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Quản lý thời gian cho phần Reading</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Đoán ý nghĩa từ context</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">IELTS Tips:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Chú ý từ khóa trong câu hỏi</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Phân biệt True/False/Not Given</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span>Skimming và Scanning hiệu quả</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
