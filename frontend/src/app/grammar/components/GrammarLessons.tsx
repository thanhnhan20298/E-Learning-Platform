'use client'

import { useState } from 'react'
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react'

interface GrammarLesson {
  id: number
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  content: {
    explanation: string
    examples: string[]
    rules: string[]
  }
  exercises: {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[]
}

export default function GrammarLessons() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showExercises, setShowExercises] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const lessons: GrammarLesson[] = [
    {
      id: 1,
      title: 'Present Simple Tense',
      level: 'Beginner',
      description: 'Học cách sử dụng thì hiện tại đơn để diễn tả thói quen và sự thật',
      content: {
        explanation: 'Thì hiện tại đơn (Present Simple) được sử dụng để diễn tả những hành động thường xuyên, thói quen, sự thật hiển nhiên hoặc lịch trình cố định.',
        examples: [
          'I work in an office. (Tôi làm việc ở văn phòng)',
          'She plays tennis every Sunday. (Cô ấy chơi tennis mỗi chủ nhật)',
          'The sun rises in the east. (Mặt trời mọc ở phía đông)',
          'The train leaves at 9 AM. (Tàu khởi hành lúc 9 giờ sáng)'
        ],
        rules: [
          'Với chủ ngữ số ít (he, she, it): động từ thêm -s/-es',
          'Với chủ ngữ số nhiều (I, you, we, they): động từ nguyên mẫu',
          'Câu phủ định: don\'t/doesn\'t + động từ nguyên mẫu',
          'Câu hỏi: Do/Does + chủ ngữ + động từ nguyên mẫu?'
        ]
      },
      exercises: [
        {
          id: 1,
          question: 'She _____ to school every day.',
          options: ['go', 'goes', 'going', 'went'],
          correctAnswer: 1,
          explanation: 'Với chủ ngữ "she" (số ít), động từ "go" phải thêm -es thành "goes".'
        },
        {
          id: 2,
          question: 'They _____ football on weekends.',
          options: ['plays', 'play', 'playing', 'played'],
          correctAnswer: 1,
          explanation: 'Với chủ ngữ "they" (số nhiều), động từ giữ nguyên dạng "play".'
        }
      ]
    },
    {
      id: 2,
      title: 'Past Simple Tense',
      level: 'Beginner',
      description: 'Học cách diễn tả các hành động đã xảy ra trong quá khứ',
      content: {
        explanation: 'Thì quá khứ đơn (Past Simple) được sử dụng để diễn tả những hành động đã hoàn thành trong quá khứ tại một thời điểm cụ thể.',
        examples: [
          'I visited my grandmother yesterday. (Tôi đã thăm bà tôi hôm qua)',
          'He worked late last night. (Anh ấy đã làm việc muộn tối qua)',
          'They didn\'t come to the party. (Họ đã không đến bữa tiệc)',
          'Did you watch the movie? (Bạn đã xem bộ phim chưa?)'
        ],
        rules: [
          'Động từ có quy tắc: thêm -ed (work → worked)',
          'Động từ bất quy tắc: học thuộc lòng (go → went, see → saw)',
          'Câu phủ định: didn\'t + động từ nguyên mẫu',
          'Câu hỏi: Did + chủ ngữ + động từ nguyên mẫu?'
        ]
      },
      exercises: [
        {
          id: 1,
          question: 'I _____ a book last night.',
          options: ['read', 'reads', 'reading', 'readed'],
          correctAnswer: 0,
          explanation: '"Read" là động từ bất quy tắc, dạng quá khứ vẫn là "read" (phát âm khác).'
        },
        {
          id: 2,
          question: 'She _____ to the store yesterday.',
          options: ['go', 'goes', 'went', 'going'],
          correctAnswer: 2,
          explanation: '"Go" là động từ bất quy tắc, dạng quá khứ là "went".'
        }
      ]
    },
    {
      id: 3,
      title: 'Present Perfect Tense',
      level: 'Intermediate',
      description: 'Học cách sử dụng thì hiện tại hoàn thành để kết nối quá khứ và hiện tại',
      content: {
        explanation: 'Thì hiện tại hoàn thành (Present Perfect) được sử dụng để diễn tả hành động bắt đầu trong quá khứ nhưng có liên quan đến hiện tại.',
        examples: [
          'I have lived here for 5 years. (Tôi đã sống ở đây được 5 năm)',
          'She has just finished her homework. (Cô ấy vừa mới hoàn thành bài tập)',
          'Have you ever been to Japan? (Bạn đã từng đến Nhật Bản chưa?)',
          'We haven\'t seen him since Monday. (Chúng tôi đã không gặp anh ấy kể từ thứ Hai)'
        ],
        rules: [
          'Cấu trúc: have/has + past participle',
          'Dùng với: just, already, yet, ever, never, since, for',
          'Câu phủ định: haven\'t/hasn\'t + past participle',
          'Câu hỏi: Have/Has + chủ ngữ + past participle?'
        ]
      },
      exercises: [
        {
          id: 1,
          question: 'I _____ my keys. I can\'t find them anywhere.',
          options: ['lose', 'lost', 'have lost', 'am losing'],
          correctAnswer: 2,
          explanation: 'Hành động mất chìa khóa xảy ra trong quá khứ nhưng ảnh hưởng đến hiện tại (không tìm thấy), dùng Present Perfect.'
        },
        {
          id: 2,
          question: '_____ you _____ your lunch yet?',
          options: ['Do/eat', 'Are/eating', 'Have/eaten', 'Did/eat'],
          correctAnswer: 2,
          explanation: 'Với "yet" trong câu hỏi, ta dùng Present Perfect: Have + past participle.'
        }
      ]
    }
  ]

  const currentLessonData = lessons[currentLesson]

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const submitExercises = () => {
    setShowResults(true)
  }

  const getScore = () => {
    let correct = 0
    currentLessonData.exercises.forEach((exercise, index) => {
      if (answers[index] === exercise.correctAnswer) {
        correct++
      }
    })
    return { correct, total: currentLessonData.exercises.length }
  }

  const resetExercises = () => {
    setAnswers([])
    setShowResults(false)
    setShowExercises(false)
  }

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      resetExercises()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ngữ Pháp</h1>
        <p className="text-gray-600">Học ngữ pháp tiếng Anh một cách có hệ thống</p>
      </div>

      {/* Lesson Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Danh sách bài học</h2>
        <div className="grid gap-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              onClick={() => {
                setCurrentLesson(index)
                resetExercises()
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                currentLesson === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lesson.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  lesson.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {lesson.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentLessonData.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            currentLessonData.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentLessonData.level}
          </span>
        </div>

        {!showExercises ? (
          <div className="space-y-6">
            {/* Explanation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Giải thích</h3>
              <p className="text-gray-700 leading-relaxed">{currentLessonData.content.explanation}</p>
            </div>

            {/* Rules */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quy tắc</h3>
              <ul className="space-y-2">
                {currentLessonData.content.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ví dụ</h3>
              <div className="space-y-3">
                {currentLessonData.content.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium">{example}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowExercises(true)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Làm bài tập
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bài tập thực hành</h3>
              <button
                onClick={() => setShowExercises(false)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Quay lại bài học
              </button>
            </div>

            {!showResults ? (
              <div className="space-y-6">
                {currentLessonData.exercises.map((exercise, exerciseIndex) => (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Câu {exerciseIndex + 1}: {exercise.question}
                    </h4>
                    <div className="space-y-2">
                      {exercise.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name={`exercise-${exerciseIndex}`}
                            value={optionIndex}
                            checked={answers[exerciseIndex] === optionIndex}
                            onChange={() => handleAnswerSelect(exerciseIndex, optionIndex)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={submitExercises}
                  disabled={answers.length < currentLessonData.exercises.length}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Nộp bài
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Kết quả</h3>
                  <p className="text-lg text-gray-600">
                    Bạn đã trả lời đúng {getScore().correct}/{getScore().total} câu
                  </p>
                  <div className="flex justify-center mt-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round((getScore().correct / getScore().total) * 5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {currentLessonData.exercises.map((exercise, exerciseIndex) => (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{exercise.question}</h4>
                    <div className="space-y-1 mb-3">
                      {exercise.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 p-2 rounded ${
                            optionIndex === exercise.correctAnswer
                              ? 'bg-green-100 text-green-800'
                              : answers[exerciseIndex] === optionIndex
                              ? 'bg-red-100 text-red-800'
                              : 'text-gray-600'
                          }`}
                        >
                          {optionIndex === exercise.correctAnswer ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : answers[exerciseIndex] === optionIndex ? (
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✗</span>
                            </div>
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>Giải thích:</strong> {exercise.explanation}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4">
                  <button
                    onClick={resetExercises}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Học lại
                  </button>
                  {currentLesson < lessons.length - 1 && (
                    <button
                      onClick={nextLesson}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Bài tiếp theo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
