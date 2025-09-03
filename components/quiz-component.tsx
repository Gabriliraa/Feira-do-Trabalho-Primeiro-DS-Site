"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLessons } from "@/lib/lesson-context"
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Qual é a estrutura básica correta de um documento HTML?",
    options: [
      "<!DOCTYPE html><html><head></head><body></body></html>",
      "<html><head></head><body></body></html>",
      "<!DOCTYPE><html><body></body></html>",
      "<head><body></body></head>",
    ],
    correctAnswer: 0,
    explanation: "Todo documento HTML deve começar com <!DOCTYPE html> seguido da estrutura html, head e body.",
  },
  {
    id: 2,
    question: "Qual tag é usada para criar um título principal em HTML?",
    options: ["<title>", "<h1>", "<header>", "<main>"],
    correctAnswer: 1,
    explanation: "A tag <h1> é usada para o título principal da página, sendo o maior nível de cabeçalho.",
  },
  {
    id: 3,
    question: "Como você cria texto em negrito em HTML?",
    options: ["<bold>texto</bold>", "<b>texto</b>", "<strong>texto</strong>", "<em>texto</em>"],
    correctAnswer: 2,
    explanation: "A tag <strong> é a forma semântica correta de criar texto em negrito, indicando importância.",
  },
  {
    id: 4,
    question: "Qual tag é usada para criar um parágrafo?",
    options: ["<paragraph>", "<p>", "<text>", "<para>"],
    correctAnswer: 1,
    explanation: "A tag <p> é usada para definir parágrafos em HTML.",
  },
  {
    id: 5,
    question: "O que a tag <br> faz?",
    options: ["Cria uma linha horizontal", "Quebra uma linha", "Cria um parágrafo", "Adiciona espaço em branco"],
    correctAnswer: 1,
    explanation: "A tag <br> cria uma quebra de linha simples, sem criar um novo parágrafo.",
  },
  {
    id: 6,
    question: "Onde deve ficar o título da página (que aparece na aba do navegador)?",
    options: ["Na tag <h1>", "Na tag <title> dentro de <head>", "Na tag <header>", "Na tag <title> dentro de <body>"],
    correctAnswer: 1,
    explanation: "O título da página deve ficar na tag <title> dentro da seção <head> do documento.",
  },
  {
    id: 7,
    question: "Qual é a diferença entre <strong> e <b>?",
    options: [
      "Não há diferença",
      "<strong> é semântico, <b> é apenas visual",
      "<b> é semântico, <strong> é apenas visual",
      "Ambas são idênticas",
    ],
    correctAnswer: 1,
    explanation: "<strong> indica importância semântica, enquanto <b> é apenas formatação visual.",
  },
  {
    id: 8,
    question: "Como você cria texto em itálico semanticamente correto?",
    options: ["<i>texto</i>", "<italic>texto</italic>", "<em>texto</em>", "<emphasis>texto</emphasis>"],
    correctAnswer: 2,
    explanation: "A tag <em> é a forma semântica de criar ênfase (itálico) em texto.",
  },
  {
    id: 9,
    question: "Qual tag cria uma linha horizontal?",
    options: ["<line>", "<hr>", "<horizontal>", "<break>"],
    correctAnswer: 1,
    explanation: "A tag <hr> (horizontal rule) cria uma linha horizontal para separar conteúdo.",
  },
  {
    id: 10,
    question: "O que significa HTML?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correctAnswer: 0,
    explanation: "HTML significa HyperText Markup Language - Linguagem de Marcação de Hipertexto.",
  },
]

interface QuizComponentProps {
  onComplete: (score: number, passed: boolean) => void
}

export function QuizComponent({ onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const { completeLesson } = useLessons()

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      calculateScore()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100)
    const passed = correctAnswers >= 6

    setScore(finalScore)
    setShowResults(true)

    if (passed) {
      completeLesson(5)
    } else {
      setShowRetryModal(true)
    }

    onComplete(finalScore, passed)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(quizQuestions.length).fill(-1))
    setShowResults(false)
    setScore(0)
    setShowExplanation(false)
    setShowRetryModal(false)
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const question = quizQuestions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const allAnswered = answers.every((answer) => answer !== -1)

  if (showRetryModal) {
    const correctAnswers = answers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4 border-2 border-red-500 bg-red-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-700">Ops! Não foi desta vez...</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-lg">
              <span className="text-red-600">Você acertou {correctAnswers} de 10 questões</span>
            </div>
            <p className="text-muted-foreground">Você precisa acertar pelo menos 6 questões para passar no quiz.</p>
            <p className="text-sm text-muted-foreground">Revise o conteúdo das lições anteriores e tente novamente!</p>
            <Button onClick={resetQuiz} className="mt-4 bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const correctAnswers = answers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length
    const passed = correctAnswers >= 6

    return (
      <div className="p-6 space-y-6">
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">Parabéns! Você passou no quiz!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold">
              <span className="text-green-600">{correctAnswers}/10</span>
            </div>
            <p className="text-muted-foreground">
              Você acertou {correctAnswers} de {quizQuestions.length} questões
            </p>
            <p className="text-sm text-muted-foreground">Você demonstrou conhecimento suficiente em HTML básico!</p>
          </CardContent>
        </Card>

        {/* Results Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revisão das Respostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizQuestions.map((q, index) => {
              const userAnswer = answers[index]
              const isCorrect = userAnswer === q.correctAnswer

              return (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Sua resposta:{" "}
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>{q.options[userAnswer]}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mb-1">Resposta correta: {q.options[q.correctAnswer]}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quiz Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quiz Final - HTML Básico</h2>
            <p className="text-muted-foreground">
              Questão {currentQuestion + 1} de {quizQuestions.length}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, Number.parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedAnswer !== -1 && (
            <div className="mt-4">
              <Button variant="outline" onClick={() => setShowExplanation(!showExplanation)} className="mb-3">
                {showExplanation ? "Ocultar" : "Ver"} Explicação
              </Button>

              {showExplanation && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          {answers.filter((a) => a !== -1).length} de {quizQuestions.length} respondidas
        </div>

        {currentQuestion === quizQuestions.length - 1 ? (
          <Button onClick={calculateScore} disabled={!allAnswered} className="bg-green-600 hover:bg-green-700">
            <Trophy className="w-4 h-4 mr-2" />
            Finalizar Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={selectedAnswer === -1}>
            Próxima
          </Button>
        )}
      </div>
    </div>
  )
}
